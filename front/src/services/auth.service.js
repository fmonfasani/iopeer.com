import { loginRequest } from "../api/auth";

export async function loginService(email, password) {
  try {
    const data = await loginRequest(email, password);

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      return { success: true };
    }

    return { success: false, error: data.detail || "Credenciales inválidas" };
  } catch (err) {
    return { success: false, error: "Error de servidor" };
  }
}
