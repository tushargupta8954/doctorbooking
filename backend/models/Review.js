import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  isRecommended: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.index({ appointment: 1 }, { unique: true });
reviewSchema.index({ doctor: 1, patient: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;