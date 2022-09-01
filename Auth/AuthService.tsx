import axios from "axios";

export const authLogin = async (username: string, password: string) => {
    const response = await axios.post(window.location.origin + '/api/login', {
        username,
        password
    });

    if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
};

export const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        return {}
    }
    return JSON.parse(user);
};