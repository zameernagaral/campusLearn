const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getUsers, updateUser, deleteUser, bulkCreateUsers,
  createDepartment, getDepartments, getDepartmentById, updateDepartment, sendBulkNotification,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

router.get('/stats', ...adminOnly, getDashboardStats);
router.get('/users', ...adminOnly, getUsers);
router.post('/users/bulk', ...adminOnly, bulkCreateUsers);
router.put('/users/:id', ...adminOnly, updateUser);
router.delete('/users/:id', ...adminOnly, deleteUser);
router.get('/departments', protect, authorize('admin', 'hod'), getDepartments);
router.get('/departments/:id', ...adminOnly, getDepartmentById);
router.post('/departments', ...adminOnly, createDepartment);
router.put('/departments/:id', ...adminOnly, updateDepartment);
router.post('/notify', ...adminOnly, sendBulkNotification);

module.exports = router;
