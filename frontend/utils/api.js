// Determine the API base URL with multiple fallbacks
const getApiBaseUrl = () => {
    // Priority 1: Environment variable from Render
    if (process.env.NEXT_PUBLIC_API_URL) {
        console.log('Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
        return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Priority 2: Check if we're in production (deployed on Render)
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // If on any Render domain, use the backend URL
        if (hostname.includes('onrender.com')) {
            console.log('Detected Render deployment, using backend URL');
            return 'https://devhub-7.onrender.com/api';
        }
    }
    
    // Priority 3: Local development
    console.log('Using local development URL');
    return 'http://localhost:4000/api';
};

const BASE_URL = getApiBaseUrl();

// Log the API URL being used (helps debug production issues)
if (typeof window !== 'undefined') {
    console.log('🔗 API Base URL:', BASE_URL);
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🏠 Hostname:', window.location.hostname);
}

// Safe localStorage helpers for SSR
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

export const api = {
    post: async (endpoint, data, token = null) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const fullUrl = `${BASE_URL}${endpoint}`;
            console.log('========================================');
            console.log('📤 API POST Request');
            console.log('🔗 Full URL:', fullUrl);
            console.log('📍 Endpoint:', endpoint);
            console.log('📦 Data:', JSON.stringify(data, null, 2));
            console.log('========================================');
            
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            
            console.log('📥 Response Status:', response.status);
            console.log('📥 Response OK:', response.ok);
            
            // Check content type before parsing
            const contentType = response.headers.get('content-type');
            
            if (!response.ok) {
                // Try to parse error as JSON, fallback to text
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.error('❌ API Error (JSON):', errorData);
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                } else {
                    const errorText = await response.text();
                    console.error('❌ API Error (Text):', errorText);
                    throw new Error(`Server error: ${response.status}. ${errorText || 'Backend might be down or unreachable.'}`);
                }
            }
            
            // Parse successful response
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('✅ API Success:', result);
                return result;
            } else {
                throw new Error('Server returned non-JSON response. Check if backend is running correctly.');
            }
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    },
    get: async (endpoint, token = null) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            console.log('API Call:', `${BASE_URL}${endpoint}`);
            
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers,
            });
            
            // Check content type before parsing
            const contentType = response.headers.get('content-type');
            
            if (!response.ok) {
                // Try to parse error as JSON, fallback to text
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                } else {
                    throw new Error(`Server error: ${response.status}. Backend might be down or unreachable.`);
                }
            }
            
            // Parse successful response
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Server returned non-JSON response. Check if backend is running correctly.');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
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
        return response.json();
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
        return response.json();
    },
};
