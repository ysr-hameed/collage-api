const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [10, 'Course code cannot exceed 10 characters']
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: 1,
    max: 10
  },
  duration: {
    type: Number,
    required: [true, 'Duration in years is required'],
    min: 1,
    max: 6
  },
  type: {
    type: String,
    required: [true, 'Course type is required'],
    enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate']
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }],
  prerequisites: [String],
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8
  },
  maxStudents: {
    type: Number,
    required: [true, 'Maximum students limit is required'],
    min: 1
  },
  currentEnrollment: {
    type: Number,
    default: 0,
    min: 0
  },
  fee: {
    type: Number,
    required: [true, 'Course fee is required'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for enrollment status
courseSchema.virtual('enrollmentStatus').get(function() {
  const percentage = (this.currentEnrollment / this.maxStudents) * 100;
  if (percentage >= 100) return 'Full';
  if (percentage >= 80) return 'Almost Full';
  if (percentage >= 50) return 'Half Full';
  return 'Available';
});

// Virtual for available seats
courseSchema.virtual('availableSeats').get(function() {
  return this.maxStudents - this.currentEnrollment;
});

// Virtual for students enrolled
courseSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'course'
});

module.exports = mongoose.model('Course', courseSchema);