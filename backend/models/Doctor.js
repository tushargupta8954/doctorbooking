import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization']
  },
  qualification: [String],
  experience: {
    type: Number,
    default: 0
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add license number'],
    unique: true
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add consultation fee']
  },
  videoConsultationFee: {
    type: Number
  },
  availableDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  availableTimeSlots: [{
    startTime: String,
    endTime: String,
    maxPatients: {
      type: Number,
      default: 10
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  earnings: {
    total: { type: Number, default: 0 },
    currentMonth: { type: Number, default: 0 },
    lastMonth: { type: Number, default: 0 }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  awards: [String],
  languages: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;