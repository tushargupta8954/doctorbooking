import express from 'express';
import { createAppointment, getPatientAppointments, getDoctorAppointments, updateAppointmentStatus, addPrescription, getPrioritizedAppointments } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/patient', protect, authorize('patient'), getPatientAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/doctor/prioritized', protect, authorize('doctor'), getPrioritizedAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.post('/:id/prescription', protect, authorize('doctor'), addPrescription);

export default router;