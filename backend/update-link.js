require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const LiveClass = require("./models/LiveClass");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      await LiveClass.updateMany({}, { meetingLink: "https://meet.google.com/sst-xvef-rvj" });
      console.log("Updated meeting links!");
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
