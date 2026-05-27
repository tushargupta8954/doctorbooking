import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import ApiResponse from '../utils/apiResponse.js';
import sendEmail from '../utils/sendEmail.js';
import { createPaymentOrder, verifyPayment } from '../utils/payment.js';

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, type, symptoms, priority } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return ApiResponse.error(res, 'Doctor not found', 404);
    }

    if (!doctor.isAvailable) {
      return ApiResponse.error(res, 'Doctor is not available', 400);
    }

    const existingAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $nin: ['cancelled', 'no-show'] }
    });

    const slotConfig = doctor.availableTimeSlots.find(
      s => s.startTime === timeSlot.startTime
    );

    if (!slotConfig || existingAppointments >= slotConfig.maxPatients) {
      return ApiResponse.error(res, 'Slot is not available', 400);
    }

    const amount = type === 'video' ? doctor.videoConsultationFee : doctor.consultationFee;
    const payment = await createPaymentOrder(amount * 100);

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      type: type || 'in-person',
      symptoms,
      priority: priority || 'normal',
      payment: {
        amount,
        method: 'razorpay',
        transactionId: payment.id
      }
    });

    await Notification.create({
      recipient: doctor.user,
      type: 'appointment_reminder',
      title: 'New Appointment Request',
      message: `New appointment request from patient`,
      data: {
        appointmentId: appointment._id,
        doctorId: doctor._id
      }
    });

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Appointment Created',
        html: `<h2>Appointment Created Successfully</h2>
               <p>Your appointment with Dr. ${doctor.user.name} has been created.</p>
               <p>Date: ${new Date(appointmentDate).toLocaleDateString()}</p>
               <p>Time: ${timeSlot.startTime} - ${timeSlot.endTime}</p>
               <p>Amount: ₹${amount}</p>`
      });
    } catch (err) {
      console.log('Email error:', err);
    }

    return ApiResponse.success(res, {
      appointment,
      paymentOrder: payment
    }, 'Appointment created successfully', 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { patient: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name avatar' }
      })
      .sort('-appointmentDate')
      .skip(skip)
      .limit(parseInt(limit));

    return ApiResponse.paginated(res, appointments, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return ApiResponse.error(res, 'Doctor profile not found', 404);
    }

    const { status, date, page = 1, limit = 10 } = req.query;
    
    let query = { doctor: doctor._id };
    
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patient',
        select: 'name email phone avatar gender dateOfBirth'
      })
      .sort('timeSlot.startTime')
      .skip(skip)
      .limit(parseInt(limit));

    return ApiResponse.paginated(res, appointments, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes, meetingLink } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return ApiResponse.error(res, 'Appointment not found', 404);
    }

    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.id) {
      return ApiResponse.error(res, 'Not authorized', 403);
    }
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
        return ApiResponse.error(res, 'Not authorized', 403);
      }
    }

    appointment.status = status;
    if (notes) appointment.notes.doctor = notes;
    if (meetingLink) appointment.meetingLink = meetingLink;

    await appointment.save();

    const recipientId = req.user.role === 'doctor' ? appointment.patient : 
                        (await Doctor.findById(appointment.doctor)).user;

    await Notification.create({
      recipient: recipientId,
      type: `appointment_${status}`,
      title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your appointment has been ${status}`,
      data: { appointmentId: appointment._id }
    });

    return ApiResponse.success(res, appointment, `Appointment ${status} successfully`);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const addPrescription = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return ApiResponse.error(res, 'Appointment not found', 404);
    }

    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return ApiResponse.error(res, 'Not authorized', 403);
    }

    const { diagnosis, medicines, tests, notes } = req.body;

    appointment.prescription = {
      diagnosis,
      medicines,
      tests,
      notes,
      issuedAt: Date.now()
    };

    appointment.status = 'completed';
    await appointment.save();

    doctor.totalPatients += 1;
    await doctor.save();

    await Notification.create({
      recipient: appointment.patient,
      type: 'prescription_ready',
      title: 'Prescription Ready',
      message: 'Your prescription is ready. Download it from your appointments.',
      data: { appointmentId: appointment._id }
    });

    try {
      const patient = await User.findById(appointment.patient);
      await sendEmail({
        email: patient.email,
        subject: 'Prescription Ready',
        html: `<h2>Your Prescription is Ready</h2>
               <p>You can download your prescription from the appointment details.</p>`
      });
    } catch (err) {
      console.log('Email error:', err);
    }

    return ApiResponse.success(res, appointment, 'Prescription added successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getPrioritizedAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return ApiResponse.error(res, 'Doctor profile not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['confirmed', 'pending'] }
    }).populate('patient', 'name age gender');

    const prioritized = appointments.map(app => {
      let priorityScore = 0;
      
      if (app.priority === 'emergency') priorityScore += 100;
      if (app.priority === 'urgent') priorityScore += 50;
      
      const severeSymptoms = ['chest pain', 'breathing difficulty', 'severe headache', 
                             'high fever', 'bleeding', 'unconsciousness'];
      if (app.symptoms) {
        const hasSevereSymptom = app.symptoms.some(s => 
          severeSymptoms.includes(s.toLowerCase())
        );
        if (hasSevereSymptom) priorityScore += 75;
      }
      
      if (app.patient.age > 65 || app.patient.age < 12) priorityScore += 25;
      
      const waitingHours = Math.abs(new Date() - app.createdAt) / 36e5;
      priorityScore += Math.min(waitingHours * 5, 30);
      
      return {
        ...app.toObject(),
        priorityScore,
        suggestedOrder: 0
      };
    });

    prioritized.sort((a, b) => b.priorityScore - a.priorityScore);
    prioritized.forEach((app, index) => {
      app.suggestedOrder = index + 1;
    });

    return ApiResponse.success(res, prioritized, 'Appointments prioritized successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};