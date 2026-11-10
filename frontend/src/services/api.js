import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// कृषि मशीनें प्राप्त करें
export const fetchMachines = async (params = {}) => {
  const response = await API.get('/machines', { params });
  return response.data;
};

// पैक्स एवं कोल्ड स्टोरेज प्राप्त करें
export const fetchStorage = async (params = {}) => {
  const response = await API.get('/storage', { params });
  return response.data;
};

// नई बुकिंग दर्ज करें
export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

// सभी बुकिंग्स प्राप्त करें
export const fetchBookings = async () => {
  const response = await API.get('/bookings');
  return response.data;
};

// बुकिंग स्थिति अपडेट करें (स्वीकार / रद्द)
export const updateBookingStatus = async (bookingId, status) => {
  const response = await API.patch(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

// नया कृषि यंत्र जोड़ें
export const createMachine = async (machineData) => {
  const response = await API.post('/machines', machineData);
  return response.data;
};

// नया पैक्स / स्टोरेज जोड़ें
export const createStorage = async (storageData) => {
  const response = await API.post('/storage', storageData);
  return response.data;
};

export default API;