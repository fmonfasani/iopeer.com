// Base URL for the authentication endpoints
import { API_BASE_URL } from '../config/apiBase';
// Defaults to localhost for development if the env variable is not provided
const API_URL = `${API_BASE_URL}/auth`;

export async function loginRequest(email, password) {
  const res = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function signupRequest(email, password) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function passwordResetRequest(email) {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return res.json();
}
