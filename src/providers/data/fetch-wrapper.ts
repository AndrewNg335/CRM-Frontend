export const fetchWrapper = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("access_token");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
};
