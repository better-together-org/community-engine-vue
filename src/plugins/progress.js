import NProgress from 'nprogress'
import axios from 'axios'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, color: '#42b983', height: '3px' })

export function setupProgress() {
  axios.interceptors.request.use((config) => {
    NProgress.start()
    return config
  })
  axios.interceptors.response.use(
    (response) => { NProgress.done(); return response },
    (error) => { NProgress.done(); return Promise.reject(error) },
  )
}
