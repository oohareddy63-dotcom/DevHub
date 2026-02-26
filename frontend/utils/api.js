// ===============================
// API Base URL Configuration
// ===============================

const getApiBaseUrl = () => {
    // ✅ Production (Render Environment Variable)
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // ✅ Local Development
    return 'http://localhost:4000/api';
};

const BASE_URL = getApiBaseUrl();

if (typeof window !== 'undefined') {
    console.log('🔗 API Base URL:', BASE_URL);
    console.log('🌍 Environment:', process.env.NODE_ENV);
}

// ===============================
// Safe localStorage Helpers (SSR Safe)
// ===============================

const getLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
};

const setLocalStorageItem = (key, value) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
};

const removeLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};

export { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem };

// ===============================
// API Helper Methods
// ===============================

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        } else {
            const errorText = await response.text();
            throw new Error(`Server error ${response.status}: ${errorText || 'Backend unreachable'}`);
        }
    }

    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    throw new Error('Server returned non-JSON response.');
};

export const api = {
    post: async (endpoint, data, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        return handleResponse(response);
    },

    get: async (endpoint, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        return handleResponse(response);
    },

    put: async (endpoint, data, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        return handleResponse(response);
    },

    delete: async (endpoint, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });

        return handleResponse(response);
    },
};