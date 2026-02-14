const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Testing Login with axios...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'superadmin@viyu.in',
            password: 'superadmin_password_123'
        });
        console.log('✅ Login Successful!');
        console.log('Token:', response.data.token);
    } catch (error) {
        console.error('❌ Login Failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testLogin();
