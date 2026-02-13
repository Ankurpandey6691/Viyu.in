const mongoose = require('mongoose');
require('dotenv').config();
const Resource = require('./models/Resource');

// Hierarchical Data Structure for SVVV
const svvvStructure = {
    college: "SVVV",
    blocks: [
        {
            name: "Main Academic Block",
            departments: [
                {
                    name: "CSE",
                    labs: [
                        { name: "Data Structures Lab", code: "DS", pcs: 30 },
                        { name: "Minor Project Lab", code: "MP", pcs: 25 },
                        { name: "Operating Systems Lab", code: "OS", pcs: 30 },
                        { name: "Computer Networks Lab", code: "CN", pcs: 25 },
                        { name: "AI/ML Lab", code: "AI", pcs: 20 }
                    ]
                },
                {
                    name: "IT",
                    labs: [
                        { name: "Web Development Lab", code: "WEB", pcs: 25 },
                        { name: "Database Lab", code: "DB", pcs: 25 },
                        { name: "Cybersecurity Lab", code: "SEC", pcs: 20 }
                    ]
                },
                {
                    name: "ECE",
                    labs: [
                        { name: "Embedded Systems Lab", code: "ES", pcs: 15 },
                        { name: "Digital Electronics Lab", code: "DE", pcs: 15 },
                        { name: "Signal Processing Lab", code: "SP", pcs: 15 }
                    ]
                }
            ]
        },
        {
            name: "Abdul Kalam Block",
            departments: [
                {
                    name: "MBA",
                    labs: [
                        { name: "Computer Lab", code: "CL", pcs: 20 },
                        { name: "Seminar Hall", code: "SH", pcs: 1 } // Projector/PC
                    ]
                },
                {
                    name: "Mechanical",
                    labs: [
                        { name: "CAD Lab", code: "CAD", pcs: 20 },
                        { name: "Simulation Lab", code: "SIM", pcs: 15 }
                    ]
                }
            ]
        },
        {
            name: "Architecture Block",
            departments: [
                {
                    name: "Architecture",
                    labs: [
                        { name: "Design Studio 1", code: "DS1", pcs: 5 },
                        { name: "Rendering Lab", code: "RL", pcs: 25 }
                    ]
                }
            ]
        }
    ]
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/viyu', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB for Seeding...');

        // Clear existing data
        await Resource.deleteMany({});
        console.log('Cleared existing resources.');

        const devices = [];

        // Generate Devices
        svvvStructure.blocks.forEach(block => {
            block.departments.forEach(dept => {
                dept.labs.forEach(lab => {
                    for (let i = 1; i <= lab.pcs; i++) {
                        const deviceId = `${dept.name}-${lab.code}-${i.toString().padStart(2, '0')}`;
                        devices.push({
                            deviceId: deviceId,
                            roomNo: lab.name,
                            block: block.name,
                            department: dept.name,
                            lab: lab.name,
                            type: 'PC',
                            status: 'Offline',
                            lastSeen: new Date()
                        });
                    }
                });
            });
        });

        // Insert Batch
        await Resource.insertMany(devices);
        console.log(`Successfully seeded ${devices.length} devices for ${svvvStructure.college}.`);

        mongoose.connection.close();
    } catch (err) {
        console.error('Seeding Error:', err);
        mongoose.connection.close();
    }
};

seedDB();
