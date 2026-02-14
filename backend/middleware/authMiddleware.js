const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. Authenticate Middleware - Verifies JWT
const authenticate = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (exclude password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user || !req.user.isActive) {
                return res.status(401).json({ message: "User not found or inactive" });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// 2. Authorize Roles Middleware - Checks if user has permitted role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// 3. Authorize Scope Middleware - Validates access to specific resources
// Usage: router.get('/:block/:lab', authorizeScope, controller)
// Assumes block/lab are in req.params or req.body, adapt as needed based on route structure
const authorizeScope = (req, res, next) => {
    const user = req.user;
    const { role, assignedBlocks, assignedLabs } = user;

    // Superadmin has full access
    if (role === 'superadmin') {
        return next();
    }

    // Identify target resource from params or body
    // This part depends heavily on how the API routes identify resources
    // For now, let's assume specific param names: 'blockId' and 'labId'
    const targetBlock = req.params.block || req.body.block; // e.g., 'A-Block'
    const targetLab = req.params.lab || req.body.lab;     // e.g., 'LAB-01'

    if (role === 'admin') {
        // Admin: Can access any lab within allowed blocks
        if (targetBlock && !assignedBlocks.includes(targetBlock)) {
            return res.status(403).json({ message: "Access to this Block is denied" });
        }
    }

    if (role === 'faculty') {
        // Faculty: Can only access specific allowed labs
        // If operation is block-wide, deny. If specific lab, check list.
        if (targetLab && !assignedLabs.includes(targetLab)) {
            return res.status(403).json({ message: "Access to this Lab is denied" });
        }
        // If route implies block access but no lab specified, Faculty might be restricted
        // unless functionality allows viewing their labs within a block
    }

    if (role === 'maintenance') {
        // Maintenance: Scope might be ticket-based, tricky to enforce generically here without Ticket model
        // For resource access, restrict similar to Faculty/Admin if they have assignments
    }

    next();
};

module.exports = { authenticate, authorizeRoles, authorizeScope };
