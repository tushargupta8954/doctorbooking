import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 
           'prescription_ready', 'payment_received', 'review_request', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    appointmentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment'
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor'
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  deliveryMethod: {
    type: String,
    enum: ['in-app', 'email', 'sms', 'push'],
    default: 'in-app'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;