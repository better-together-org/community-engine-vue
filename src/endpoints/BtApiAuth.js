import axios from 'axios'

const BtApiAuth = axios.create({
  baseURL: `${import.meta.env.VITE_BETTER_TOGETHER_API_URI}/bt/api/auth`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
  },
})

export default BtApiAuth
