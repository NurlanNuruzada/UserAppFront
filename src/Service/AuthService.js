import { httpClient } from "../Utils/HttpClient";

export const login = (data) => {
    return httpClient.post('api/Auth/Login', data);
};
export const Register = (data) => {
    return httpClient.post('/api/Auth/register', data);
};
export const refreshToken = (data) => {
    return httpClient.post('/api/Auth/RefreshToken', data);
};
