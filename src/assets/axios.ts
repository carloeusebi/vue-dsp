import axios, { AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores';

const baseURL = `${import.meta.env.VITE_API_URL}` || 'http://localhost:8000/api';

const axiosInstance = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

axiosInstance.interceptors.response.use(
	res => {
		if (res.status >= 200 && res.status <= 299) {
			return res;
		}
		return Promise.reject(res);
	},
	err => {
		if (axios.isAxiosError(err)) {
			if (
				(err.response?.status === 401 && err.response?.data.message !== 'invalid-credentials') ||
				err.response?.status === 403
			) {
				const auth = useAuthStore();
				auth.removeUser();
			} else if (err.response?.status === 500) {
				console.warn(err.response?.data);
				(err.response as AxiosResponse).data = {
					message: 'Si è verificato un problema interno al server. Se il problema persiste contattare il supporto!',
				};
			}
		}
		return Promise.reject(err);
	}
);

export default axiosInstance;
