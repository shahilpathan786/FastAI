// Centralized API fetch utility with automatic token injection
const API_BASE_URL = "https://fastai-production.up.railway.app/api";

export async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = token;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        window.dispatchEvent(new Event("userLogout"));
      }
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function login(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name, email, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, confirm_password: password }),
  });
}
