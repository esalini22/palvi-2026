import axios from 'axios'
const baseUrl = 'http://localhost:3000/api';

const getCollections = async () => {
  try {
    const response = await axios.get(`${baseUrl}/datasets`)
    return response.data
  } catch (error) {
    console.error('Error:', error);
    return null
  }
}

const getMetrics = async (collection: string = '') => {
  try {
    const response = await axios.get(`${baseUrl}/metrics?collection=${collection}`)
    return response.data
  } catch (error) {
    console.error('Error:', error);
    return null
  }
}

const getDays = async (collection: string = '', metric: string = '') => {
  try {
    const response = await axios.get(`${baseUrl}/days?collection=${collection}&metric=${metric}`)
    return response.data
  } catch (error) {
    console.error('Error:', error);
    return null
  }
}

export { getCollections, getMetrics, getDays }