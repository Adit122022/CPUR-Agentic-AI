import axios from "axios";

export const API_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

// We will use a helper to set the token before requests in components
// or use a hook that provides an authenticated axios instance.
// For now, we'll keep the interceptor logic but it needs to be dynamic.
// Since getToken() is asynchronous and depends on the Clerk context, 
// a custom hook for API calls is preferred.

export const endpoints = {
  content: {
    add: "/content/",
    get: "/content/",
    delete: "/content/",
  },
  share: {
    share: "/brain/share",
    get: "/brain/",
  },
};

export default api;
