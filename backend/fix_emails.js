require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');

const MONGO_URI = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const allUsers = await User.find({ role: { $in: ['student', 'faculty', 'hod'] } }).populate('department');
    console.log(`Found ${allUsers.length} users to update emails for.`);

    let updatedCount = 0;
    
    // Fetch all departments to map IDs if needed, but we already populated it
    
    for (const user of allUsers) {
      if (!user.department) continue;
      
      // Extract clean first name
      // Example: "Dr. Maya Iyer" -> "maya", "Sai Ahluwalia" -> "sai"
      let cleanName = user.name.replace(/^Dr\.\s*/i, '').split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      if (!cleanName) cleanName = 'user';

      const deptCode = user.department.code ? user.department.code.toLowerCase() : 'dept';
      
      let success = false;
      let attempts = 0;

      while (!success && attempts < 10) {
        // Generate a 2-digit number (10-99)
        const randomNum = Math.floor(Math.random() * 90) + 10;
        const newEmail = `${cleanName}.${deptCode}${randomNum}@rajeshwari.ac.in`;

        try {
          // Check if this exact email is already used by someone else
          const existing = await User.findOne({ email: newEmail });
          if (!existing || existing._id.toString() === user._id.toString()) {
            user.email = newEmail;
            await user.save();
            success = true;
            updatedCount++;
          } else {
            attempts++;
          }
        } catch (e) {
          // E11000 duplicate key error caught by save
          attempts++;
        }
      }
      
      if (!success) {
        console.log(`Failed to generate unique email for ${user.name}`);
      }
    }

    console.log(`Successfully updated emails for ${updatedCount} users.`);
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
