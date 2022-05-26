export const TIMEZONE_OFFSET = (new Date()).getTimezoneOffset() * 60 * 1000; 

export const getUser = () => {
    const userStr = sessionStorage.getItem('user');

    if (userStr) {
        return JSON.parse(userStr);
    } else {
        return null;
    }
};

export const getToken = () => {
    return sessionStorage.getItem('token') || null;
};

export const removeUserSession = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
};

export const setUserSession = (user: any, token: any) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
};