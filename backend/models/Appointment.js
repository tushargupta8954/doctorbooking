import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please add appointment date']
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['in-person', 'video'],
    default: 'in-person'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  symptoms: [String],
  aiSuggestedSpecialization: String,
  payment: {
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['razorpay', 'stripe', 'cash'],
      default: 'razorpay'
    },
    transactionId: String,
    paidAt: Date
  },
  prescription: {
    diagnosis: String,
    medicines: [{
      name: String,
      dosage: String,
      duration: String,
      frequency: String,
      instructions: String
    }],
    tests: [String],
    notes: String,
    issuedAt: Date
  },
  meetingLink: String,
  notes: {
    patient: String,
    doctor: String
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin']
    },
    cancelledAt: Date
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  followUp: {
    required: Boolean,
    date: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'payment.status': 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;