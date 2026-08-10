const express = require('express');
const router = express.Router();
const { getLiveClasses, createLiveClass } = require('../controllers/liveClassController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getLiveClasses);
router.post('/', protect, authorize('faculty'), createLiveClass);

module.exports = router;
