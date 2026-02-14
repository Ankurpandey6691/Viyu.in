const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const debugLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/viyu');
        console.log('Connected to DB');

        const email = 'superadmin@viyu.in';
        const password = 'superadmin_password_123';

        console.log(`Checking user: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('✅ User found:', user.email, user.role);
        console.log('User Active:', user.isActive);

        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            console.log('✅ Password Match');
        } else {
            console.log('❌ Password Mismatch');
            // Debug hash
            console.log('Stored Hash:', user.password);
            const newHash = await bcrypt.hash(password, 10);
            console.log('Test Hash:', newHash);
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

debugLogin();
