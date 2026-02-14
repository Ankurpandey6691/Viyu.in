require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedSuperadmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/viyu', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        const superAdminExists = await User.findOne({ role: 'superadmin' });

        if (superAdminExists) {
            console.log('Superadmin already exists');
        } else {
            const superAdmin = new User({
                name: 'System Superadmin',
                email: 'superadmin@viyu.in',
                password: 'superadmin_password_123', // Will be hashed by pre-save hook
                role: 'superadmin',
                assignedBlocks: ['ALL'],
                assignedLabs: ['ALL']
            });

            await superAdmin.save();
            console.log('Superadmin created successfully');
            console.log('Email: superadmin@viyu.in');
            console.log('Password: superadmin_password_123');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding superadmin:', error);
        process.exit(1);
    }
};

seedSuperadmin();
