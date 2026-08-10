const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models/User');
  const roles = ['admin', 'hod', 'faculty', 'student'];
  console.log('# CampusLearn Demo Users\n');
  for (const role of roles) {
    const users = await User.find({ role }).select('name email role');
    console.log(`### ${role.toUpperCase()}`);
    users.forEach(u => {
      console.log(`- **${u.name}**: \`${u.email}\``);
    });
    console.log('');
  }
  process.exit(0);
});
