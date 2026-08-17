const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');

const models = [
  // Career
  { name: 'CareerGoal', schema: `{ title: {type: String, required: true}, description: String, category: String, skillsRequired: [{type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}] }` },
  { name: 'CareerRoadmap', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, goal: {type: mongoose.Schema.Types.ObjectId, ref: 'CareerGoal'}, targetRole: String, currentLevel: String, preferredDomain: String, targetIndustry: String, graduationYear: Number, currentSemester: Number }` },
  { name: 'Skill', schema: `{ name: {type: String, required: true}, category: String, difficulty: String, relatedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}] }` },
  { name: 'StudentSkill', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, skill: {type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}, status: {type: String, enum: ['Not Started', 'Learning', 'Practicing', 'Completed'], default: 'Not Started'}, progress: {type: Number, default: 0} }` },
  { name: 'CareerRecommendation', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, type: {type: String, enum: ['Course', 'Video', 'Note', 'Project', 'Certification', 'Internship', 'Preparation']}, itemRefId: mongoose.Schema.Types.ObjectId, itemModel: String, reason: String }` },

  // Timetable
  { name: 'Timetable', schema: `{ department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'}, semester: Number, section: String, createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, isApproved: {type: Boolean, default: false} }` },
  { name: 'TimetableEvent', schema: `{ timetable: {type: mongoose.Schema.Types.ObjectId, ref: 'Timetable'}, subject: String, faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, classroom: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'}, startTime: Date, endTime: Date, classType: String, meetingLink: String, status: {type: String, enum: ['Upcoming', 'Live Now', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Upcoming'}, notes: String }` },
  { name: 'Classroom', schema: `{ name: {type: String, required: true}, capacity: Number, location: String, department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'} }` },

  // Exam Preparation
  { name: 'ExamPortion', schema: `{ subject: String, semester: Number, section: String, faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, examType: String, examDate: Date, referenceNotes: [String], referenceVideos: [String], previousPapers: [String], units: [String], subtopics: [String] }` },
  { name: 'ExamTopic', schema: `{ portion: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamPortion'}, name: String, importance: {type: String, enum: ['Very Important', 'Important', 'Moderate', 'Low Priority']}, weightage: Number, isCompleted: {type: Boolean, default: false} }` },
  { name: 'StudyPlan', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, portion: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamPortion'}, dailyTargetMinutes: Number, startDate: Date, endDate: Date }` },
  { name: 'StudySession', schema: `{ plan: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyPlan'}, topic: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamTopic'}, date: Date, durationMinutes: Number, status: {type: String, enum: ['Planned', 'Completed', 'Missed'], default: 'Planned'} }` },
  { name: 'ExamPreparationProgress', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, portion: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamPortion'}, completedTopics: [{type: mongoose.Schema.Types.ObjectId, ref: 'ExamTopic'}], overallProgress: {type: Number, default: 0} }` },

  // Attendance Extra
  { name: 'AttendanceAlert', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, subject: String, currentPercentage: Number, requiredPercentage: Number, riskLevel: {type: String, enum: ['SAFE', 'WARNING', 'SHORTAGE RISK', 'CRITICAL']}, message: String, isRead: {type: Boolean, default: false} }` },
  { name: 'AttendanceRule', schema: `{ department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'}, requiredPercentage: {type: Number, default: 75}, warningThreshold: {type: Number, default: 85}, shortageThreshold: {type: Number, default: 75}, criticalThreshold: {type: Number, default: 70} }` },

  // Placement
  { name: 'PlacementProfile', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, readinessScore: {type: Number, default: 0}, aptitudeScore: {type: Number, default: 0}, codingScore: {type: Number, default: 0}, technicalScore: {type: Number, default: 0}, communicationScore: {type: Number, default: 0}, resumeScore: {type: Number, default: 0}, interviewScore: {type: Number, default: 0} }` },
  { name: 'AptitudeQuestion', schema: `{ category: String, subCategory: String, difficulty: {type: String, enum: ['Easy', 'Medium', 'Hard']}, questionText: String, options: [String], correctAnswer: String, explanation: String }` },
  { name: 'CodingQuestion', schema: `{ title: String, category: String, difficulty: {type: String, enum: ['Easy', 'Medium', 'Hard']}, problemStatement: String, constraints: String, testCases: [{input: String, output: String}], hints: [String], solution: String }` },
  { name: 'TechnicalQuestion', schema: `{ category: String, question: String, answer: String, explanation: String }` },
  { name: 'HRQuestion', schema: `{ question: String, guidance: String }` },
  { name: 'InterviewSession', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, jobRole: String, interviewType: {type: String, enum: ['Technical', 'HR', 'Coding', 'Mixed']}, difficulty: String, overallScore: Number, feedback: String, strengths: [String], weaknesses: [String], recommendations: [String] }` },
  { name: 'InterviewAnswer', schema: `{ session: {type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession'}, question: String, answer: String, score: Number, aiFeedback: String }` },
  { name: 'ResumeProfile', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, personalInfo: mongoose.Schema.Types.Mixed, careerObjective: String, education: [mongoose.Schema.Types.Mixed], projects: [mongoose.Schema.Types.Mixed], experience: [mongoose.Schema.Types.Mixed], skills: [String], achievements: [String] }` },
  { name: 'ResumeAnalysis', schema: `{ resume: {type: mongoose.Schema.Types.ObjectId, ref: 'ResumeProfile'}, score: Number, atsCompatibility: Number, missingSkills: [String], improvements: [String] }` },
  { name: 'ResumeTemplate', schema: `{ name: String, layoutCode: String }` },
  { name: 'Company', schema: `{ name: {type: String, required: true}, logo: String, industry: String, description: String }` },
  { name: 'CompanyPreparation', schema: `{ company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'}, requiredSkills: [String], preparationTopics: [String], aptitudeTags: [String], codingTags: [String], interviewStages: [String] }` },
  { name: 'PlacementProgress', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, completedStages: [String], currentStage: String }` },
  { name: 'PlacementAchievement', schema: `{ student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'}, role: String, dateSecured: Date, package: String }` },
];

models.forEach(m => {
  const fileContent = `const mongoose = require('mongoose');

const ${m.name}Schema = new mongoose.Schema(
  ${m.schema},
  { timestamps: true }
);

module.exports = mongoose.model('${m.name}', ${m.name}Schema);
`;
  fs.writeFileSync(path.join(modelsDir, m.name + '.js'), fileContent);
  console.log('Created ' + m.name + '.js');
});
