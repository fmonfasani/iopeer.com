// Base URL for the authentication endpoints
// Defaults to localhost for development if the env variable is not provided
const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/auth`;

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
