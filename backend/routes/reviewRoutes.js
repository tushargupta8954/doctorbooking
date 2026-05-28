import express from 'express';
import { createReview, getDoctorReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), createReview);
router.get('/doctor/:doctorId', getDoctorReviews);
router.put('/:id', protect, authorize('patient'), updateReview);
router.delete('/:id', protect, authorize('patient', 'admin'), deleteReview);

export default router;