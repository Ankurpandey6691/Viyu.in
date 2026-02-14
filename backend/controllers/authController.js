const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login Attempt:', { email, password }); // DEBUG LOG

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isActive) {
                return res.status(401).json({ message: "Account is deactivated. Contact admin." });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                assignedBlocks: user.assignedBlocks,
                assignedLabs: user.assignedLabs,
                token: generateToken(user._id, user.role, user.assignedBlocks, user.assignedLabs),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Start of userController logic - typically moved there but kept here if structure demands, 
// though plan says separate controller. 
// For now, removing register as per requirements.

module.exports = { login };