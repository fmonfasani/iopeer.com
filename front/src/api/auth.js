const API_URL = "http://localhost:8000/auth";

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
