const mongoose = require('mongoose');
require('dotenv').config();
const Resource = require('./models/Resource');
const Lab = require('./models/Lab');

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
        await Lab.deleteMany({});
        console.log('Cleared existing resources and labs.');

        const devices = [];
        const labsToInsert = [];

        // Generate Devices and Labs
        for (const block of svvvStructure.blocks) {
            for (const dept of block.departments) {
                for (const labData of dept.labs) {

                    // Create Lab
                    const newLab = new Lab({
                        name: labData.name,
                        code: labData.code,
                        department: dept.name,
                        block: block.name,
                        isSessionActive: false
                    });

                    // We need to save the lab immediately to get its _id for the resources? 
                    // Or we can just build the array and rely on finding them?
                    // Better to insert one by one or batch insert Labs first, then map them?
                    // Let's batch insert Labs first to be efficient, then map back.
                    labsToInsert.push(newLab);
                }
            }
        }

        // Insert Labs first
        const insertedLabs = await Lab.insertMany(labsToInsert);
        console.log(`Successfully seeded ${insertedLabs.length} labs.`);

        // Create a Map for quick Lab lookup by code
        const labMap = new Map();
        insertedLabs.forEach(lab => labMap.set(lab.code, lab._id));

        // Generate Devices and link to Lab _id
        for (const block of svvvStructure.blocks) {
            for (const dept of block.departments) {
                for (const labData of dept.labs) {
                    const labId = labMap.get(labData.code); // Get the _id from the map

                    if (!labId) {
                        console.error(`Lab ID not found for code: ${labData.code}`);
                        continue;
                    }

                    for (let i = 1; i <= labData.pcs; i++) {
                        const deviceId = `${dept.name}-${labData.code}-${i.toString().padStart(2, '0')}`;
                        devices.push({
                            deviceId: deviceId,
                            roomNo: labData.name,
                            block: block.name,
                            department: dept.name,
                            lab: labId, // Use the ObjectId reference
                            labCode: labData.code,
                            type: 'PC',
                            status: 'Offline',
                            lastSeen: new Date()
                        });
                    }
                }
            }
        }

        await Resource.insertMany(devices);
        console.log(`Successfully seeded ${devices.length} devices.`);

        mongoose.connection.close();
    } catch (err) {
        console.error('Seeding Error:', err);
        mongoose.connection.close();
    }
};

seedDB();
