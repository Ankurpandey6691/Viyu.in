const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Removed Block/Lab model imports as they are no longer used for validation

// @desc    Create a new user (Superadmin Only) - NO SCOPE ASSIGNMENT
// @route   POST /api/users/create
// @access  Private (Superadmin)
const createUser = async (req, res) => {
    const { name, email, role, assignedLabs, password } = req.body;
    const requesterRole = req.user.role;

    // Security Check: Superadmin creation blocked
    if (role === 'superadmin') {
        return res.status(403).json({ message: "Cannot create Superadmin accounts via this interface." });
    }

    // Admin Restriction: Can only create Faculty
    if (requesterRole === 'admin') {
        if (role !== 'faculty') {
            return res.status(403).json({ message: "Admins can only create Faculty accounts." });
        }

        // Scope Enforcement: Must assign labs within Admin's block
        const adminBlocks = req.user.assignedBlocks;
        if (!adminBlocks || adminBlocks.length === 0) {
            return res.status(400).json({ message: "Admin has no assigned block to manage." });
        }
    }

    // Role Validation
    const allowedRoles = ['admin', 'faculty', 'maintenance'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role selected." });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Use provided password or auto-generate
        const finalPassword = password || crypto.randomBytes(8).toString('hex');

        // Lazy import Resource to avoid circular dependency issues if any, though likely fine here
        const Resource = require("../models/Resource");

        // Prepare User Data
        let userData = {
            name,
            email,
            password: finalPassword,
            role,
            assignedBlocks: [],
            assignedLabs: [],
            createdBy: req.user._id,
            isActive: true
        };

        // If Admin creating Faculty, enforce scope
        if (requesterRole === 'admin' && role === 'faculty') {
            const adminBlocks = req.user.assignedBlocks;

            // Fetch valid labs logic was missing/broken in previous edit
            const validLabs = await Resource.find({ block: { $in: adminBlocks } }).distinct('lab');

            if (assignedLabs && assignedLabs.length > 0) {
                const allValid = assignedLabs.every(lab => validLabs.includes(lab));
                if (!allValid) {
                    return res.status(400).json({ message: "Cannot assign labs outside your managed block." });
                }
                userData.assignedLabs = assignedLabs;
            }
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                message: "User created successfully.",
                temporaryPassword: finalPassword, // Send back the password used (whether manual or auto)
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    assignedBlocks: user.assignedBlocks,
                    assignedLabs: user.assignedLabs
                }
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Assign Scope to User (Superadmin Only)
// @route   PUT /api/users/:id/assign-scope
// @access  Private (Superadmin)
const assignUserScope = async (req, res) => {
    const { assignedBlocks, assignedLabs } = req.body; // Expecting Arrays of Strings (Circuit Names)
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'superadmin') {
            return res.status(403).json({ message: "Cannot assign specific scope to Superadmin (Access: ALL)" });
        }

        // ADMIN / MAINTENANCE -> BLOCKS ONLY
        if (user.role === 'admin' || user.role === 'maintenance') {
            if (assignedLabs && assignedLabs.length > 0) {
                return res.status(400).json({ message: "Admins/Maintenance cannot be assigned Labs." });
            }

            // direct assignment of strings (No ID validation against strict collection)
            user.assignedBlocks = assignedBlocks || [];
            user.assignedLabs = []; // Clear labs
        }

        // FACULTY -> LABS ONLY
        else if (user.role === 'faculty') {
            if (assignedBlocks && assignedBlocks.length > 0) {
                return res.status(400).json({ message: "Faculty cannot be assigned Blocks directly." });
            }

            // direct assignment of strings
            user.assignedLabs = assignedLabs || [];
            user.assignedBlocks = []; // Clear blocks
        }

        await user.save();

        // Return user (Strings are already populated)
        const updatedUser = await User.findById(user._id);

        res.json({ message: "Scope updated", user: updatedUser });

    } catch (error) {
        console.error("Assign Scope Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Reset User Password (Superadmin Only)
// @route   POST /api/users/:id/reset-password
const resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const temporaryPassword = crypto.randomBytes(8).toString('hex');
        user.password = temporaryPassword; // Will be hashed
        await user.save();

        res.json({ message: "Password reset successful", temporaryPassword });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Superadmin)
const getUsers = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'admin') {
            query = { role: { $nin: ['superadmin', 'admin'] } };
        }

        // Scope names are now stored directly as strings
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update user (e.g. deactivate)
// @route   PUT /api/users/:id
// @access  Private (Admin/Superadmin)
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Authorization check: Admin cannot modify Superadmin
        if (user.role === 'superadmin') {
            return res.status(403).json({ message: "Cannot modify Superadmin" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isActive: updatedUser.isActive
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

module.exports = {
    createUser,
    assignUserScope,
    resetPassword,
    getUsers,
    updateUser
};
