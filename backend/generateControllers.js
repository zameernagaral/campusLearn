const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const routesDir = path.join(__dirname, 'routes');

const controllers = {
  career: {
    methods: ['getRoadmap', 'createRoadmap', 'updateRoadmap', 'createGoal', 'getRecommendations', 'addSkill', 'updateSkill'],
    routes: [
      { path: '/roadmap', methods: { get: 'getRoadmap', post: 'createRoadmap', put: 'updateRoadmap' } },
      { path: '/goals', methods: { post: 'createGoal' } },
      { path: '/recommendations', methods: { get: 'getRecommendations' } },
      { path: '/skills', methods: { post: 'addSkill' } },
      { path: '/skills/:id', methods: { put: 'updateSkill' } }
    ]
  },
  timetable: {
    methods: ['getTimetable', 'createTimetable', 'updateTimetable', 'deleteTimetable', 'checkConflict', 'rescheduleClass', 'cancelClass'],
    routes: [
      { path: '/', methods: { get: 'getTimetable', post: 'createTimetable' } },
      { path: '/:id', methods: { put: 'updateTimetable', delete: 'deleteTimetable' } },
      { path: '/check-conflict', methods: { post: 'checkConflict' } },
      { path: '/reschedule', methods: { post: 'rescheduleClass' } },
      { path: '/cancel', methods: { post: 'cancelClass' } }
    ]
  },
  exams: {
    methods: ['getPortions', 'createPortion', 'updatePortion', 'getTopics', 'createStudyPlan', 'getStudyProgress'],
    routes: [
      { path: '/portions', methods: { get: 'getPortions', post: 'createPortion' } },
      { path: '/portions/:id', methods: { put: 'updatePortion' } },
      { path: '/topics', methods: { get: 'getTopics' } },
      { path: '/study-plan', methods: { post: 'createStudyPlan' } },
      { path: '/study-progress', methods: { get: 'getStudyProgress' } }
    ]
  },
  attendanceIntelligence: {
    methods: ['getRisk', 'getShortage', 'getPrediction', 'getAlerts', 'sendAlert'],
    routes: [
      { path: '/risk', methods: { get: 'getRisk' } },
      { path: '/shortage', methods: { get: 'getShortage' } },
      { path: '/prediction', methods: { get: 'getPrediction' } },
      { path: '/alerts', methods: { get: 'getAlerts' } },
      { path: '/alerts/send', methods: { post: 'sendAlert' } }
    ]
  },
  placement: {
    methods: ['getDashboard', 'getAptitude', 'submitAptitudeTest', 'getCoding', 'startMockTest', 'startInterview', 'answerInterview', 'completeInterview', 'analyzeResume', 'getCompanies', 'getCompanyById', 'getProgress'],
    routes: [
      { path: '/dashboard', methods: { get: 'getDashboard' } },
      { path: '/aptitude', methods: { get: 'getAptitude' } },
      { path: '/aptitude/test', methods: { post: 'submitAptitudeTest' } },
      { path: '/coding', methods: { get: 'getCoding' } },
      { path: '/mock-test', methods: { post: 'startMockTest' } },
      { path: '/interview/start', methods: { post: 'startInterview' } },
      { path: '/interview/answer', methods: { post: 'answerInterview' } },
      { path: '/interview/complete', methods: { post: 'completeInterview' } },
      { path: '/resume/analyze', methods: { post: 'analyzeResume' } },
      { path: '/companies', methods: { get: 'getCompanies' } },
      { path: '/companies/:id', methods: { get: 'getCompanyById' } },
      { path: '/progress', methods: { get: 'getProgress' } }
    ]
  }
};

for (const [name, config] of Object.entries(controllers)) {
  const controllerFile = path.join(controllersDir, name + 'Controller.js');
  const routerFile = path.join(routesDir, name + '.js');

  // Controller Content
  let controllerContent = `const asyncHandler = require('../utils/asyncHandler');\n\n`;
  config.methods.forEach(method => {
    controllerContent += `exports.${method} = asyncHandler(async (req, res) => {\n  res.status(200).json({ success: true, data: 'Not implemented yet' });\n});\n\n`;
  });
  fs.writeFileSync(controllerFile, controllerContent);
  console.log(`Created ${controllerFile}`);

  // Router Content
  let routerContent = `const express = require('express');\nconst router = express.Router();\nconst { protect, authorize } = require('../middleware/auth');\nconst controller = require('../controllers/${name}Controller');\n\n`;
  config.routes.forEach(route => {
    for (const [verb, method] of Object.entries(route.methods)) {
      routerContent += `router.${verb}('${route.path}', protect, controller.${method});\n`;
    }
  });
  routerContent += `\nmodule.exports = router;\n`;
  fs.writeFileSync(routerFile, routerContent);
  console.log(`Created ${routerFile}`);
}
