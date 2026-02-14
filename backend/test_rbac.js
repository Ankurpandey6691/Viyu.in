const axios = require('axios');

const API_URL = 'http://localhost:49669/api';

const runTests = async () => {
    try {
        console.log('--- Starting RBAC Verification Tests ---');

        // 1. Login as Superadmin
        console.log('\n1. Testing Superadmin Login...');
        let superToken = '';
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'superadmin@viyu.in',
                password: 'superadmin_password_123'
            });
            if (res.status === 200 && res.data.token) {
                superToken = res.data.token;
                console.log('✅ Superadmin Login Successful');
                console.log('   Token received');
            } else {
                console.log('❌ Superadmin Login Failed');
            }
        } catch (err) {
            console.error('❌ Superadmin Login Error:', err.response ? err.response.data : err.message);
            return; // Stop if superadmin login fails
        }

        // 2. Create Admin User (as Superadmin)
        console.log('\n2. Testing Admin Creation (by Superadmin)...');
        let adminToken = '';
        const adminEmail = `admin_${Date.now()}@viyu.in`;
        try {
            const res = await axios.post(`${API_URL}/users/create`, {
                name: 'Test Admin',
                email: adminEmail,
                password: 'admin_password',
                role: 'admin',
                assignedBlocks: ['A-Block'],
                assignedLabs: ['LAB-01']
            }, {
                headers: { Authorization: `Bearer ${superToken}` }
            });

            if (res.status === 201) {
                console.log('✅ Admin User Created Successfully');
            }
        } catch (err) {
            console.error('❌ Admin Creation Error:', err.response ? err.response.data : err.message);
        }

        // 3. Login as New Admin
        console.log('\n3. Testing New Admin Login...');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: adminEmail,
                password: 'admin_password'
            });
            if (res.status === 200 && res.data.token) {
                adminToken = res.data.token;
                console.log('✅ New Admin Login Successful');
            }
        } catch (err) {
            console.error('❌ New Admin Login Error:', err.response ? err.response.data : err.message);
        }

        // 4. Try to Create Superadmin (as Admin) - Should Fail
        console.log('\n4. Testing Unauthorized Role Creation (Admin creating Superadmin)...');
        try {
            await axios.post(`${API_URL}/users/create`, {
                name: 'Fake Superadmin',
                email: 'fake_super@viyu.in',
                password: 'password',
                role: 'superadmin'
            }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('❌ Admin was able to create Superadmin (Security Vulnerability!)');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ Admin blocked from creating Superadmin (403 Forbidden received)');
            } else {
                console.error('❌ Unexpected Error:', err.response ? err.response.data : err.message);
            }
        }

        // 5. Try to Access Protected Route without Token
        console.log('\n5. Testing Access without Token...');
        try {
            await axios.get(`${API_URL}/users`);
            console.log('❌ Protected route accessed without token (Security Vulnerability!)');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log('✅ Access denied without token (401 Unauthorized received)');
            } else {
                console.error('❌ Unexpected Error:', err.response ? err.response.data : err.message);
            }
        }

        console.log('\n--- RBAC Verification Complete ---');

    } catch (error) {
        console.error('Global Test Error:', error.message);
    }
};

runTests();
