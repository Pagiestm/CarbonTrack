// src/helpers/token.js
export const getToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decodedToken = JSON.parse(jsonPayload);

    // Vérifie si le token a expiré
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
        return { token: null, decodedToken: null, expired: true };
    }

    return { token, decodedToken, expired: false };
};

export const getHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
});

export const isAdmin = () => {
    const tokenData = getToken();
    if (!tokenData || tokenData.expired) {
        return false;
    }
    const { decodedToken } = tokenData;
    return decodedToken.role === 'ADMIN';
};