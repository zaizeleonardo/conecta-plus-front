const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function fetchAPI(endpoint, options = {}) {

    const token = localStorage.getItem('token')

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    }

    if (token) {

        headers.Authorization = `Bearer ${token}`
    }

    return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    })
}

export default API_URL