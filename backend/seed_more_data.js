require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');

const MONGO_URI = process.env.MONGODB_URI;

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Sanya", "Diya", "Priya", "Neha", "Kavya", "Isha", "Riya", "Ananya", "Sneha", "Tanvi", "Rahul", "Vikram", "Rohan", "Kabir", "Rishi", "Aryan", "Karan", "Nikhil", "Pranav", "Harsh", "Mira", "Tara", "Kiara", "Nisha", "Simran", "Meera", "Aisha", "Pooja", "Maya", "Kriti"];
const lastNames = ["Sharma", "Verma", "Patel", "Singh", "Kumar", "Rao", "Reddy", "Gupta", "Nair", "Iyer", "Menon", "Jain", "Mehta", "Desai", "Joshi", "Chopra", "Kapur", "Das", "Bose", "Mukherjee", "Chatterjee", "Bhatt", "Chauhan", "Yadav", "Ahluwalia", "Agarwal", "Kaur", "Pandey", "Mishra", "Tiwari"];

function generateRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // 1. Create more departments if they don't exist
    const newDepartments = [
      { name: 'Information Technology', code: 'IT', description: 'Computing, Networking and Software' },
      { name: 'Electrical Engineering', code: 'EE', description: 'Power systems and electrical machinery' },
      { name: 'Biotechnology', code: 'BIOTECH', description: 'Bio-engineering and life sciences' },
      { name: 'Aerospace Engineering', code: 'AERO', description: 'Aircraft and spacecraft design' },
      { name: 'Data Science', code: 'DS', description: 'AI, Machine Learning and Big Data' }
    ];

    for (const d of newDepartments) {
      const exists = await Department.findOne({ code: d.code });
      if (!exists) {
        await Department.create(d);
        console.log(`Created new department: ${d.name}`);
      }
    }

    const allDepartments = await Department.find();
    console.log(`\nFound ${allDepartments.length} total departments.`);

    const hashedPassword = await bcrypt.hash('password123', 10);
    const newUsers = [];

    let counter = 0;

    // 2. Add students and faculty to make it 60 students and 6 faculty per department
    for (const dept of allDepartments) {
      const studentCount = await User.countDocuments({ department: dept._id, role: 'student' });
      const facultyCount = await User.countDocuments({ department: dept._id, role: { $in: ['faculty', 'hod'] } });

      const studentsNeeded = Math.max(0, 60 - studentCount);
      const facultyNeeded = Math.max(0, 6 - facultyCount);

      console.log(`${dept.code}: Has ${studentCount} students, ${facultyCount} faculty. Adding ${studentsNeeded} students and ${facultyNeeded} faculty.`);

      // Generate Students
      for (let i = 0; i < studentsNeeded; i++) {
        const name = generateRandomName();
        const email = `student.${dept.code.toLowerCase()}.${Date.now()}_${counter++}@campuslearn.edu`;
        newUsers.push({
          name,
          email,
          password: hashedPassword,
          role: 'student',
          department: dept._id,
          isActive: true
        });
      }

      // Generate Faculty
      for (let i = 0; i < facultyNeeded; i++) {
        const name = `Dr. ${generateRandomName()}`;
        const email = `faculty.${dept.code.toLowerCase()}.${Date.now()}_${counter++}@campuslearn.edu`;
        newUsers.push({
          name,
          email,
          password: hashedPassword,
          role: 'faculty',
          department: dept._id,
          isActive: true
        });
      }
    }

    // 3. Insert generated users
    if (newUsers.length > 0) {
      console.log(`\nInserting ${newUsers.length} new users into the database...`);
      // Insert in chunks to avoid bulk write size limits
      const chunkSize = 100;
      for (let i = 0; i < newUsers.length; i += chunkSize) {
        const chunk = newUsers.slice(i, i + chunkSize);
        await User.insertMany(chunk);
      }
      console.log(`Successfully added all new users.`);
    } else {
      console.log(`\nDepartments already meet the target numbers!`);
    }

    // 4. Update counts and ensure HOD is assigned
    for (const dept of allDepartments) {
      const finalStudents = await User.countDocuments({ department: dept._id, role: 'student' });
      const finalFacultyList = await User.find({ department: dept._id, role: { $in: ['faculty', 'hod'] } });
      
      dept.totalStudents = finalStudents;
      dept.totalFaculty = finalFacultyList.length;

      if (!dept.hod && finalFacultyList.length > 0) {
        dept.hod = finalFacultyList[0]._id;
      }
      
      await dept.save();
    }
    console.log('\nRecalculated all department counts and confirmed HODs.');

    console.log('\nSeed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

run();
