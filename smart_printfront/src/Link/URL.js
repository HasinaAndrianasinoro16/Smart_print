export const BASE_URL = "http://localhost:8000/api";
export const COOKIE_URL = "http://localhost:8000/sanctum/csrf-cookie";
export const URL_SIMPLE = "http://localhost:8000/";
export const getApiUrl = (path = '') => `${BASE_URL}/${path}`;
export const getCookie = () => COOKIE_URL;
export const getURL = () => URL_SIMPLE;