import axios from 'axios'

export default axios.create({
  baseURL: 'BACKEND_URL_GOES_HERE',
  timeout: 20000,
  withCredentials: true
})
