import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/appointments';

const initialState = {
  appointments: [],
  appointment: null,
  prioritizedAppointments: [],
  isLoading: false,
  isError: false,
  message: '',
  pagination: null,
};

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL, appointmentData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPatientAppointments = createAsyncThunk(
  'appointments/getPatient',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/patient`, { ...config, params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDoctorAppointments = createAsyncThunk(
  'appointments/getDoctor',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/doctor`, { ...config, params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status, notes, meetingLink }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${API_URL}/${id}/status`, { status, notes, meetingLink }, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addPrescription = createAsyncThunk(
  'appointments/addPrescription',
  async ({ id, prescriptionData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_URL}/${id}/prescription`, prescriptionData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPrioritizedAppointments = createAsyncThunk(
  'appointments/getPrioritized',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/doctor/prioritized`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    reset: (state) => {
      state.appointment = null;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload.data;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPatientAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatientAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPatientAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getDoctorAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(addPrescription.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(getPrioritizedAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPrioritizedAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prioritizedAppointments = action.payload.data;
      })
      .addCase(getPrioritizedAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;