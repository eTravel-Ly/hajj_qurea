import axios from 'axios';
import { reactive } from 'vue';

const API_AUTH_BASE_URL = import.meta.env.VITE_API_AUTH_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLIENT_ID = import.meta.env.VITE_API_AUTH_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_API_AUTH_CLIENT_SECRET;

export const authState = reactive({
    user: null,
    isAuthenticated: !!localStorage.getItem('app-token'),
});

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

apiClient.interceptors.request.use(async (config) => {
    let token = localStorage.getItem('app-token');
    const refreshToken = localStorage.getItem('refresh-token');

    if (token && refreshToken) {
        const decoded = parseJwt(token);
        const now = Date.now() / 1000;

        if (decoded && decoded.exp < now) {
            try {
                const params = new URLSearchParams();
                params.append('grant_type', 'refresh_token');
                params.append('client_id', CLIENT_ID);
                params.append('client_secret', CLIENT_SECRET);
                params.append('refresh_token', refreshToken);

                const response = await axios.post(
                    `${API_AUTH_BASE_URL}/realms/ly/protocol/openid-connect/token`,
                    params,
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                );

                token = response.data.access_token;
                localStorage.setItem('app-token', token);
                localStorage.setItem('refresh-token', response.data.refresh_token);
            } catch (error) {
                console.error("Session expired", error);
                logout();
                return Promise.reject(error);
            }
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function login(username, password) {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('scope', 'openid offline_access');
    params.append('username', username);
    params.append('password', password);

    return axios.post(`${API_AUTH_BASE_URL}/realms/ly/protocol/openid-connect/token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(response => {
        localStorage.setItem('app-token', response.data.access_token);
        localStorage.setItem('refresh-token', response.data.refresh_token);
        authState.isAuthenticated = true;
        return response.data;
    });
}

export function logout() {
    localStorage.removeItem('app-token');
    localStorage.removeItem('refresh-token');
    authState.isAuthenticated = false;
    window.location.href = '/login';
}

export default apiClient;
