import axios from 'axios'

const client = axios.create({ baseURL: '/ktv-api', timeout: 10001 })
client.interceptors.request.use(config => {
  const token = localStorage.getItem('ktv-token')
  // A stale KTV session must never be sent while establishing a new staff
  // session. Some reverse proxies/security filters reject an invalid token
  // before the public login endpoint is reached.
  const url = String(config.url || '')
  if (token && !url.includes('/sessions/')) config.headers['X-KTV-Token'] = token
  return config
})

export const ktvLogin = payload => client.post('/sessions/staff', payload)
export const ktvLogout = () => client.delete('/session')
export const getKtvState = () => client.get('/state')
export const getKtvOrders = params => client.get('/orders', { params })
export const exportKtvOrders = params => client.get('/orders/export', { params, responseType: 'blob' })
export const batchOrderAction = payload => client.post('/orders/batch-action', payload)
export const getKtvOrderDetail = id => client.get(`/orders/${encodeURIComponent(id)}`)
export const reassignKtvOrder = (id, payload) => client.post(`/orders/${encodeURIComponent(id)}/reassign`, payload)
export const updateProduct = (id, payload) => client.put(`/products/${id}`, payload)
export const deleteProduct = id => client.delete(`/products/${encodeURIComponent(id)}`)
export const createCategory = payload => client.post('/categories', payload)
export const renameCategory = (name, payload) => client.put(`/categories/${encodeURIComponent(name)}`, payload)
export const deleteCategory = name => client.delete(`/categories/${encodeURIComponent(name)}`)
export const updateRoom = (id, payload, originalId = id) => client.put(`/rooms/${encodeURIComponent(originalId)}`, payload)
export const deleteRoom = id => client.delete(`/rooms/${encodeURIComponent(id)}`)
// The backend exposes one QR endpoint for both H5 and mini-program codes.
// Keep the admin page on the same route used by the mobile client so a QR
// generated in either console is immediately usable by customers.
export const generateRoomQRCode = (id, options = {}) => {
  // Production customer entry is the WeChat mini-program. H5 remains
  // available only when the operator explicitly selects it.
  const params = new URLSearchParams({ type: options.type || 'mini' })
  if (options.rotate) params.set('rotate', 'true')
  return client.post(`/rooms/${encodeURIComponent(id)}/qr?${params.toString()}`)
}
export const createAccount = payload => client.post('/accounts', payload)
export const updateAccount = (id, payload) => client.put(`/accounts/${encodeURIComponent(id)}`, payload)
export const deleteAccount = id => client.delete(`/accounts/${encodeURIComponent(id)}`)
export const reviewRefund = (id, payload) => client.post(`/orders/${id}/refund-review`, payload)
export const uploadKtvImage = file => {
  const form = new FormData()
  form.append('file', file)
  // Let the browser add the multipart boundary. Setting Content-Type manually
  // can make desktop browsers send a request without a readable file part.
  return client.post('/images', form)
}
export default client
