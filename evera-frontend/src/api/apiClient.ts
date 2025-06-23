import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";
import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";
import type { Result } from "#/api";
import { ResultStuts } from "#/enum";

const axiosInstance = axios.create({
	baseURL: "http://localhost:5000",
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

axiosInstance.interceptors.request.use(
	(config) => {
		const { userToken } = userStore.getState();
		if (userToken.accessToken) {
			config.headers.Authorization = `Bearer ${userToken.accessToken}`;
		}
		console.log('API Request:', {
			method: config.method?.toUpperCase(),
			url: config.url,
			baseURL: config.baseURL,
			fullURL: `${config.baseURL}${config.url}`,
			data: config.data
		});
		return config;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(res: AxiosResponse<Result<any> | any>) => {
		if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));
		
		// Handle different response formats
		const { status, data, message } = res.data;
		
		// If the response has a status field, treat it as a Result type
		if (status !== undefined) {
			if (status === ResultStuts.SUCCESS) {
				return data;
			}
			throw new Error(message || t("sys.api.apiRequestFailed"));
		}
		
		// If no status field, return the data directly
		return res.data;
	},
	(error: AxiosError<Result | any>) => {
		const { response, message } = error || {};
		console.log('API Error Response:', {
			status: response?.status,
			statusText: response?.statusText,
			data: response?.data,
			message: message
		});
		
		// Extract user-friendly error message
		let userFriendlyMessage = "Something went wrong. Please try again.";
		
		if (response?.data) {
			// Handle different error response formats
			if (typeof response.data === 'string') {
				userFriendlyMessage = response.data;
			} else if (response.data.message) {
				// Check for common validation error messages and make them more user-friendly
				const message = response.data.message;
				if (message.includes('email') && message.includes('already')) {
					userFriendlyMessage = "An account with this email already exists. Please use a different email or try logging in.";
				} else if (message.includes('password') && message.includes('weak')) {
					userFriendlyMessage = "Password is too weak. Please use a stronger password with at least 8 characters.";
				} else if (message.includes('email') && message.includes('invalid')) {
					userFriendlyMessage = "Please enter a valid email address.";
				} else if (message.includes('required')) {
					userFriendlyMessage = "Please fill in all required fields.";
				} else if (message.includes('email') && message.includes('verify') || message.includes('verification')) {
					userFriendlyMessage = "Please verify your email address before logging in. Check your inbox for a verification link.";
				} else if (message.includes('account') && message.includes('lock') || message.includes('locked')) {
					userFriendlyMessage = "Your account has been temporarily locked due to too many failed login attempts. Please try again in 30 minutes.";
				} else if (message.includes('rate') && message.includes('limit')) {
					userFriendlyMessage = "Too many login attempts. Please wait 15 minutes before trying again.";
				} else if (message.includes('token') && message.includes('expired')) {
					userFriendlyMessage = "This link has expired. Please request a new password reset link.";
				} else if (message.includes('token') && message.includes('invalid')) {
					userFriendlyMessage = "This link is invalid. Please request a new password reset link.";
				} else {
					userFriendlyMessage = message;
				}
			} else if ((response.data as any).error) {
				userFriendlyMessage = (response.data as any).error;
			} else if (Array.isArray(response.data)) {
				// Handle validation errors array
				userFriendlyMessage = response.data.map((err: any) => err.message || err).join(', ');
			} else if ((response.data as any).errors) {
				// Handle validation errors object
				const errors = (response.data as any).errors;
				if (typeof errors === 'object') {
					const errorMessages = Object.values(errors).flat();
					userFriendlyMessage = Array.isArray(errorMessages) ? errorMessages.join(', ') : String(errorMessages);
				}
			}
		} else if (response?.status) {
			// Handle HTTP status codes
			switch (response.status) {
				case 400:
					userFriendlyMessage = "Invalid data provided. Please check your information and try again.";
					break;
				case 401:
					userFriendlyMessage = "Authentication failed. Please check your credentials.";
					break;
				case 403:
					userFriendlyMessage = "Access denied. You don't have permission to perform this action.";
					break;
				case 404:
					userFriendlyMessage = "The requested resource was not found.";
					break;
				case 409:
					userFriendlyMessage = "An account with this email already exists. Please use a different email or try logging in.";
					break;
				case 422:
					userFriendlyMessage = "Validation failed. Please check your input and try again.";
					break;
				case 500:
					userFriendlyMessage = "Server error. Please try again later.";
					break;
				default:
					userFriendlyMessage = message || "Something went wrong. Please try again.";
			}
		}
		
		toast.error(userFriendlyMessage, { position: "top-center" });
		if (response?.status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "GET" });
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return axiosInstance.request<any, T>(config);
	}
}

export default new APIClient();
