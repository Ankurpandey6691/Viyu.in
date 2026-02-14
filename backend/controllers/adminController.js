const User = require("../models/User");
const Block = require("../models/Block");
const Resource = require("../models/Resource");
const Lab = require("../models/Lab");

// @desc    Assign a block to an Admin (Superadmin Only)
// @route   POST /api/admin/assign-block
// @access  Superadmin
const assignBlock = async (req, res) => {
    try {
        const { adminId, blockName } = req.body;

        if (!adminId || !blockName) {
            return res.status(400).json({ message: "Admin ID and Block Name are required" });
        }

        const user = await User.findById(adminId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify valid block
        const blockExists = await Block.findOne({ name: blockName });
        if (!blockExists) {
            return res.status(404).json({ message: "Block does not exist" });
        }

        // Assign Block (singular)
        user.assignedBlock = blockName;
        // Clear singular array for consistency if we ever use it
        user.assignedBlocks = [blockName];

        await user.save();

        res.json({
            message: `Block '${blockName}' assigned to ${user.name}`,
            user: {
                id: user._id,
                name: user.name,
                assignedBlock: user.assignedBlock
            }
        });

    } catch (error) {
        console.error("Assign Block Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Admin Dashboard Overview
// @route   GET /api/admin/overview
// @access  Private (Admin)
const getAdminOverview = async (req, res) => {
    try {
        const assignedBlock = req.user.assignedBlock;

        if (!assignedBlock) {
            return res.status(400).json({ message: "No block assigned to this Admin." });
        }

        // Stats
        const totalDevices = await Resource.countDocuments({ block: assignedBlock });
        const onlineDevices = await Resource.countDocuments({ block: assignedBlock, status: 'Online' });
        const offlineDevices = await Resource.countDocuments({ block: assignedBlock, status: 'Offline' });

        // Distinct Labs in this block
        const labs = await Lab.find({ block: assignedBlock }).countDocuments();

        res.json({
            assignedBlock,
            stats: {
                totalLabs: labs,
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

module.exports = {
    assignBlock,
    getAdminOverview
};
