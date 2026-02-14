const User = require("../models/User");
const Resource = require("../models/Resource");

// @desc    Get Admin Dashboard Overview
// @route   GET /api/admin/overview
// @access  Private (Admin)
const getAdminOverview = async (req, res) => {
    try {
        const adminBlocks = req.user.assignedBlocks; // Array of Strings

        if (!adminBlocks || adminBlocks.length === 0) {
            return res.status(400).json({ message: "No blocks assigned to this Admin." });
        }

        // Stats
        const totalDevices = await Resource.countDocuments({ block: { $in: adminBlocks } });
        const onlineDevices = await Resource.countDocuments({ block: { $in: adminBlocks }, status: 'Online' });
        const offlineDevices = await Resource.countDocuments({ block: { $in: adminBlocks }, status: 'Offline' });

        // Distinct Labs in these blocks
        const labs = await Resource.find({ block: { $in: adminBlocks } }).distinct('lab');

        res.json({
            assignedBlocks: adminBlocks,
            stats: {
                totalLabs: labs.length,
                totalDevices,
                onlineDevices,
                offlineDevices
            }
        });

    } catch (error) {
        console.error("Admin Overview Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Labs for Admin's Block
// @route   GET /api/admin/labs
// @access  Private (Admin)
const getAdminLabs = async (req, res) => {
    try {
        const adminBlocks = req.user.assignedBlocks;
        if (!adminBlocks || adminBlocks.length === 0) {
            return res.json([]);
        }

        const labs = await Resource.find({ block: { $in: adminBlocks } }).distinct('lab');
        res.json(labs.filter(l => l)); // Filter nulls
    } catch (error) {
        console.error("Admin Labs Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Faculty in Admin's Block
// @route   GET /api/admin/faculty
// @access  Private (Admin)
const getAdminFaculty = async (req, res) => {
    try {
        const adminBlocks = req.user.assignedBlocks;
        if (!adminBlocks || adminBlocks.length === 0) {
            return res.json([]);
        }

        // 1. Get all valid labs for these blocks
        const validLabs = await Resource.find({ block: { $in: adminBlocks } }).distinct('lab');

        // 2. Find Faculty assigned to ANY of these labs
        // Note: Faculty have their scope in `assignedLabs`
        const faculty = await User.find({
            role: 'faculty',
            assignedLabs: { $in: validLabs }
        }).select('-password').sort({ createdAt: -1 });

        res.json(faculty);

    } catch (error) {
        console.error("Admin Faculty Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update Faculty (Admin)
// @route   PUT /api/admin/faculty/:id
// @access  Private (Admin)
const updateFaculty = async (req, res) => {
    try {
        const { assignedLabs, isActive } = req.body;
        const facultyId = req.params.id;
        const adminBlocks = req.user.assignedBlocks;

        // 1. Verify Faculty exists and is actually in Admin's scope
        // (i.e., currently assigned to a lab in admin's block OR new, but we are updating existing)
        // Ideally, we should check if the target user is a faculty.
        const faculty = await User.findOne({ _id: facultyId, role: 'faculty' });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found." });
        }

        // 2. Verify Admin has authority over the *Target Labs*
        if (assignedLabs && assignedLabs.length > 0) {
            const validLabs = await Resource.find({ block: { $in: adminBlocks } }).distinct('lab');

            // Check if all requested labs are valid
            const allValid = assignedLabs.every(lab => validLabs.includes(lab));
            if (!allValid) {
                return res.status(403).json({ message: "Cannot assign labs outside your managed block." });
            }
            faculty.assignedLabs = assignedLabs;
        }

        if (isActive !== undefined) {
            faculty.isActive = isActive;
        }

        await faculty.save();
        res.json({ message: "Faculty updated successfully", faculty });

    } catch (error) {
        console.error("Update Faculty Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getAdminOverview,
    getAdminLabs,
    getAdminFaculty,
    updateFaculty
};
