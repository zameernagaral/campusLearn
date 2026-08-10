const CalendarEvent = require('../models/CalendarEvent');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    const { course } = req.query;
    const query = {};

    if (course) {
      query.course = course;
    }

    if (req.user.role === 'student') {
      // Students see events for their enrolled courses AND general events (no course)
      if (course) {
        // If course is specified, ensure they are enrolled
        const enrolledStr = (req.user.enrolledCourses || []).map(id => id.toString());
        if (!enrolledStr.includes(course)) {
          return successResponse(res, 200, 'Events fetched successfully', []);
        }
      } else {
        query.$or = [
          { course: { $exists: false } },
          { course: null },
          { course: { $in: req.user.enrolledCourses || [] } }
        ];
      }
    } else if (req.user.role === 'faculty') {
      // Faculty can see events they created or for their teaching courses
      if (!course) {
        query.$or = [
          { createdBy: req.user._id },
          { course: { $in: req.user.teachingCourses || [] } },
          { course: { $exists: false } },
          { course: null }
        ];
      }
    }

    const events = await CalendarEvent.find(query)
      .populate('course', 'title subjectCode')
      .sort({ startTime: 1 });

    successResponse(res, 200, 'Events fetched successfully', events);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a calendar event
// @route   POST /api/calendar
// @access  Private (Faculty/Admin)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, type, startTime, endTime, location, course } = req.body;

    if (!title || !startTime || !endTime) {
      return errorResponse(res, 400, 'Please provide title, startTime, and endTime');
    }

    const eventData = {
      title,
      description,
      type,
      startTime,
      endTime,
      location,
      createdBy: req.user._id
    };

    if (course && course !== "") {
      eventData.course = course;
    }

    const event = await CalendarEvent.create(eventData);

    successResponse(res, 201, 'Event created successfully', event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a calendar event
// @route   DELETE /api/calendar/:id
// @access  Private (Faculty/Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    // Check authorization: only creator or admin can delete
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to delete this event');
    }

    await event.deleteOne();

    successResponse(res, 200, 'Event deleted successfully', {});
  } catch (error) {
    next(error);
  }
};
