require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Course = require('./models/Course');

const MONGO_URI = process.env.MONGODB_URI;

const courseTopics = {
  'CSE': ['Data Structures', 'Machine Learning', 'Cloud Computing', 'Web Development', 'Operating Systems'],
  'IT': ['Network Security', 'Database Management', 'Software Engineering', 'IoT Applications', 'Blockchain Basics'],
  'EE': ['Circuit Design', 'Electromagnetics', 'Power Systems', 'Control Systems', 'Digital Electronics'],
  'MECH': ['Thermodynamics', 'Fluid Mechanics', 'Robotics', 'Manufacturing Processes', 'Automotive Engineering'],
  'CIVIL': ['Structural Analysis', 'Fluid Dynamics', 'Geotechnical Engineering', 'Construction Planning', 'Transportation Engineering'],
  'BIOTECH': ['Genetics', 'Molecular Biology', 'Bioinformatics', 'Immunology', 'Bioprocess Engineering'],
  'AERO': ['Aerodynamics', 'Propulsion', 'Flight Mechanics', 'Avionics', 'Spacecraft Dynamics'],
  'DS': ['Big Data Analytics', 'Deep Learning', 'Data Visualization', 'Statistical Methods', 'Natural Language Processing'],
  'ECE': ['VLSI Design', 'Signal Processing', 'Microprocessors', 'Wireless Communication', 'Optical Networks'],
  'CS-BS': ['Business Analytics', 'Enterprise Systems', 'IT Project Management', 'Financial Computing', 'Digital Marketing']
};

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Wipe out existing courses for a clean realistic state
    await Course.deleteMany({});
    console.log('Cleared existing courses.');

    const departments = await Department.find();
    let coursesCreated = 0;

    for (const dept of departments) {
      const code = dept.code.toUpperCase();
      const topics = courseTopics[code] || ['Intro to ' + dept.name, 'Advanced ' + dept.name, 'Seminar in ' + dept.name];
      
      const facultyList = await User.find({ department: dept._id, role: { $in: ['faculty', 'hod'] } });
      const studentList = await User.find({ department: dept._id, role: 'student' });
      
      if (facultyList.length === 0) continue;

      // Pick 3 random topics to create courses
      for (let i = 0; i < 3; i++) {
        const topicIndex = Math.floor(Math.random() * topics.length);
        const topic = topics[topicIndex];
        
        // Pick a random faculty
        const faculty = facultyList[Math.floor(Math.random() * facultyList.length)];
        
        // Pick a random number of students to enroll (10 to 40)
        const numEnrolled = Math.min(Math.floor(Math.random() * 30) + 10, studentList.length);
        const enrolledStudents = [];
        for (let s = 0; s < numEnrolled; s++) {
           const student = studentList[Math.floor(Math.random() * studentList.length)];
           if (!enrolledStudents.includes(student._id)) {
               enrolledStudents.push(student._id);
           }
        }

        await Course.create({
          title: topic,
          description: `This is a comprehensive course covering all fundamentals and advanced topics in ${topic}.`,
          shortDescription: `Master the concepts of ${topic}.`,
          faculty: faculty._id,
          department: dept._id,
          semester: Math.floor(Math.random() * 8) + 1,
          credits: 3,
          isPublished: Math.random() > 0.2, // 80% published
          isApproved: true,
          enrolledStudents: enrolledStudents
        });

        coursesCreated++;
      }
    }

    console.log(`Successfully generated ${coursesCreated} realistic courses across all departments!`);
    process.exit(0);
  } catch (error) {
    console.error('Course seeding failed:', error);
    process.exit(1);
  }
}

run();
