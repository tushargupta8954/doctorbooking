import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/doctors';

const initialState = {
  doctors: [],
  doctor: null,
  isLoading: false,
  isError: false,
  message: '',
  pagination: null,
};

// Get all doctors
export const getDoctors = createAsyncThunk(
  'doctors/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single doctor
export const getDoctor = createAsyncThunk(
  'doctors/getOne',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update doctor profile
export const updateDoctorProfile = createAsyncThunk(
  'doctors/updateProfile',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.put(`${API_URL}/profile`, data, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    reset: (state) => {
      state.doctor = null;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearDoctors: (state) => {
      state.doctors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getDoctor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctor = action.payload.data;
      })
      .addCase(getDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.doctor = action.payload.data;
      });
  },
});

export const { reset: resetDoctor, clearDoctors } = doctorSlice.actions;
export default doctorSlice.reducer;