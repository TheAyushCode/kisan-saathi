import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
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

export default API;