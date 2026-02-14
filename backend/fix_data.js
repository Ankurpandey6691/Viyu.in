const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Update all users to have empty arrays (clearing invalid string data)
        const result = await User.updateMany({}, {
            $set: {
                assignedBlocks: [],
                assignedLabs: []
            }
        });

        console.log(`Updated ${result.modifiedCount} users.`);
        console.log("Legacy scope data cleared.");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixData();
