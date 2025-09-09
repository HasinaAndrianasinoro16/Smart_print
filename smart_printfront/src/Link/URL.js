export const BASE_URL = "http://localhost/api";
export const COOKIE_URL = "http://localhost/sanctum/csrf-cookie";
export const URL_SIMPLE = "http://localhost/";
export const getApiUrl = (path = '') => `${BASE_URL}/${path}`;
export const getCookie = () => COOKIE_URL;
export const getURL = () => URL_SIMPLE;