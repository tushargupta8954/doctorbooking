import Review from '../models/Review.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import ApiResponse from '../utils/apiResponse.js';

export const createReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, title, comment, isRecommended } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return ApiResponse.error(res, 'Appointment not found', 404);
    }

    if (appointment.status !== 'completed') {
      return ApiResponse.error(res, 'Can only review completed appointments', 400);
    }

    const existingReview = await Review.findOne({ appointment: appointmentId });
    if (existingReview) {
      return ApiResponse.error(res, 'You have already reviewed this appointment', 400);
    }

    const review = await Review.create({
      patient: req.user.id,
      doctor: doctorId,
      appointment: appointmentId,
      rating,
      title,
      comment,
      isRecommended
    });

    const reviews = await Review.find({ doctor: doctorId });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    await Doctor.findByIdAndUpdate(doctorId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    return ApiResponse.success(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getDoctorReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments({ doctor: req.params.doctorId });

    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate('patient', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    return ApiResponse.paginated(res, reviews, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return ApiResponse.error(res, 'Review not found', 404);
    }

    if (review.patient.toString() !== req.user.id) {
      return ApiResponse.error(res, 'Not authorized', 403);
    }

    const { rating, title, comment } = req.body;
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    const reviews = await Review.find({ doctor: review.doctor });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    await Doctor.findByIdAndUpdate(review.doctor, {
      averageRating: Math.round(avgRating * 10) / 10
    });

    return ApiResponse.success(res, review, 'Review updated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return ApiResponse.error(res, 'Review not found', 404);
    }

    if (review.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized', 403);
    }

    await review.deleteOne();

    const reviews = await Review.find({ doctor: review.doctor });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length 
      : 0;
    
    await Doctor.findByIdAndUpdate(review.doctor, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    return ApiResponse.success(res, null, 'Review deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};