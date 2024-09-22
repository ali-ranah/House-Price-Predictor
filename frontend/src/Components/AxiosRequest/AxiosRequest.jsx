// axiosInstance.js

import axios from 'axios';

const AxiosRequest = axios.create({
  baseURL: 'http://localhost:3001'
});

export default AxiosRequest;
