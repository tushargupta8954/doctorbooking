import express from 'express';
import { getDoctors, getDoctor, updateDoctorProfile, getDoctorDashboard, updateAvailability } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/dashboard', protect, authorize('doctor'), getDoctorDashboard);
router.get('/:id', getDoctor);
router.put('/profile', protect, authorize('doctor'), upload.single('avatar'), updateDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);

export default router;