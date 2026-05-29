import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';
import ApiResponse from '../utils/apiResponse.js';
import cloudinary from '../utils/cloudinary.js';

// Helper Functions
const getNextAvailableSlot = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.isAvailable || doctor.availableTimeSlots.length === 0) {
    return null;
  }

  const now = new Date();
  const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  if (doctor.availableDays.includes(today)) {
    const currentTime = now.getHours() + ':' + now.getMinutes();
    
    const nextSlot = doctor.availableTimeSlots.find(slot => {
      return slot.startTime > currentTime;
    });

    if (nextSlot) {
      return {
        date: now.toISOString().split('T')[0],
        startTime: nextSlot.startTime,
        endTime: nextSlot.endTime
      };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + i);
    const nextDay = nextDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    if (doctor.availableDays.includes(nextDay)) {
      return {
        date: nextDate.toISOString().split('T')[0],
        startTime: doctor.availableTimeSlots[0].startTime,
        endTime: doctor.availableTimeSlots[0].endTime
      };
    }
  }

  return null;
};

const getAvailableSlotsForWeek = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.isAvailable) return [];

  const slots = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    if (doctor.availableDays.includes(day)) {
      const dateStr = date.toISOString().split('T')[0];
      
      for (const slot of doctor.availableTimeSlots) {
        const bookedInSlot = await Appointment.countDocuments({
          doctor: doctorId,
          appointmentDate: {
            $gte: new Date(dateStr),
            $lt: new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + 1))
          },
          'timeSlot.startTime': slot.startTime,
          status: { $nin: ['cancelled'] }
        });

        if (bookedInSlot < slot.maxPatients) {
          slots.push({
            date: dateStr,
            day: date.toLocaleDateString('en-US', { weekday: 'long' }),
            startTime: slot.startTime,
            endTime: slot.endTime,
            available: slot.maxPatients - bookedInSlot,
            maxPatients: slot.maxPatients
          });
        }
      }
    }
  }

  return slots;
};

// Controller Functions
export const getDoctors = async (req, res) => {
  try {
    const {
      specialization,
      search,
      minRating,
      maxFee,
      minFee,
      available,
      city,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (city) {
      const userIds = await User.find({
        'address.city': { $regex: city, $options: 'i' }
      }).select('_id');
      query.user = { $in: userIds.map(u => u._id) };
    }

    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = parseFloat(minFee);
      if (maxFee) query.consultationFee.$lte = parseFloat(maxFee);
    }

    if (available === 'true') {
      query.isAvailable = true;
    }

    if (search) {
      const userIds = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      query.$or = [
        { user: { $in: userIds.map(u => u._id) } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort === 'rating') sortOption = { averageRating: -1 };
    else if (sort === 'experience') sortOption = { experience: -1 };
    else if (sort === 'fee_low') sortOption = { consultationFee: 1 };
    else if (sort === 'fee_high') sortOption = { consultationFee: -1 };
    else sortOption = { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Doctor.countDocuments(query);

    const doctors = await Doctor.find(query)
      .populate({
        path: 'user',
        select: 'name email avatar phone address gender'
      })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const doctorsWithSlots = await Promise.all(
      doctors.map(async (doctor) => {
        const nextSlot = await getNextAvailableSlot(doctor._id);
        return {
          ...doctor.toObject(),
          nextAvailableSlot: nextSlot
        };
      })
    );

    return ApiResponse.paginated(res, doctorsWithSlots, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email avatar phone address gender dateOfBirth'
      });

    if (!doctor) {
      return ApiResponse.error(res, 'Doctor not found', 404);
    }

    const reviews = await Review.find({ doctor: req.params.id })
      .populate({
        path: 'patient',
        select: 'name avatar'
      })
      .sort('-createdAt')
      .limit(10);

    const availableSlots = await getAvailableSlotsForWeek(doctor._id);

    return ApiResponse.success(res, {
      doctor,
      reviews,
      availableSlots
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ✅ FIXED: updateDoctorProfile function with proper User model reference
export const updateDoctorProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return ApiResponse.error(res, 'Doctor profile not found', 404);
    }

    // ✅ Get the user document for avatar handling
    const user = await User.findById(req.user.id);

    const allowedFields = [
      'specialization', 'qualification', 'experience', 'bio',
      'consultationFee', 'videoConsultationFee', 'availableDays',
      'availableTimeSlots', 'education', 'awards', 'languages'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    // Handle avatar upload
    if (req.file) {
      // ✅ FIXED: Using user.avatar instead of doctor.user.avatar
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'doctor-avatars',
        width: 300,
        height: 300,
        crop: 'fill'
      });

      // ✅ Update the User model's avatar
      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url
      };
      await user.save();
    }

    await doctor.save();

    // Update user fields (name, phone, address)
    const userFields = ['name', 'phone', 'address'];
    const userUpdate = {};
    userFields.forEach(field => {
      if (req.body[field] !== undefined) {
        userUpdate[field] = req.body[field];
      }
    });

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(req.user.id, userUpdate);
    }

    const updatedDoctor = await Doctor.findById(doctor._id)
      .populate('user', 'name email avatar phone address');

    return ApiResponse.success(res, updatedDoctor, 'Profile updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return ApiResponse.error(res, 'Doctor profile not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: { $gte: today, $lt: tomorrow }
    }).populate('patient', 'name email phone avatar');

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      appointmentDate: { $gte: firstDayOfMonth }
    });

    const monthlyEarnings = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          appointmentDate: { $gte: firstDayOfMonth },
          'payment.status': 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.amount' }
        }
      }
    ]);

    const recentPatients = await Appointment.distinct('patient', {
      doctor: doctor._id,
      status: 'completed'
    });

    const recentPatientIds = recentPatients.slice(-5);
    const patientDetails = await User.find({
      _id: { $in: recentPatientIds }
    }).select('name email phone avatar');

    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          appointmentDate: { $gte: firstDayOfMonth }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return ApiResponse.success(res, {
      todayAppointments,
      monthlyAppointments,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      recentPatients: patientDetails,
      appointmentStats,
      totalPatients: doctor.totalPatients,
      averageRating: doctor.averageRating,
      totalReviews: doctor.totalReviews
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return ApiResponse.error(res, 'Doctor profile not found', 404);
    }

    const { availableDays, availableTimeSlots, isAvailable } = req.body;

    if (availableDays) doctor.availableDays = availableDays;
    if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

    await doctor.save();

    return ApiResponse.success(res, doctor, 'Availability updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};