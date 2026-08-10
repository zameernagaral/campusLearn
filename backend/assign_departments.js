require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');

const MONGO_URI = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    let departments = await Department.find();
    if (departments.length === 0) {
      console.log('No departments found!');
      process.exit(1);
    }

    // Force reassign ALL students, faculty, and hods evenly across existing departments
    const allUsers = await User.find({ role: { $in: ['student', 'faculty', 'hod'] } });
    console.log(`Found ${allUsers.length} users to distribute.`);
    
    let assignedCount = 0;
    for (const user of allUsers) {
      const randomDept = departments[Math.floor(Math.random() * departments.length)];
      user.department = randomDept._id;
      await user.save();
      assignedCount++;
    }
    console.log(`Force assigned ${assignedCount} users to departments.`);

    // Assign HODs and update counts
    for (const dept of departments) {
      const students = await User.countDocuments({ department: dept._id, role: 'student' });
      const facultyList = await User.find({ department: dept._id, role: { $in: ['faculty', 'hod'] } });
      
      dept.totalStudents = students;
      dept.totalFaculty = facultyList.length;

      if (facultyList.length > 0) {
        dept.hod = facultyList[0]._id;
        console.log(`Assigned ${facultyList[0].name} as HOD for ${dept.code}.`);
      } else {
        dept.hod = null; // Unset HOD if no faculty
      }
      
      await dept.save();
    }
    console.log('Updated department stats and HODs.');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
