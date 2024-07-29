// src/helpers/token.js
export const getToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return { token, decodedToken: JSON.parse(jsonPayload) };
};

export const getHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
});

export const isAdmin = () => {
    const { decodedToken } = getToken();
    return decodedToken && decodedToken.role && decodedToken.role.includes('ADMIN');
};
