import { loginRequest, signupRequest, passwordResetRequest } from "../api/auth";

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

export async function signupService(email, password) {
  try {
    const data = await signupRequest(email, password);

    if (data.message) {
      return { success: true };
    }

    return { success: false, error: data.detail || "Error" };
  } catch (err) {
    return { success: false, error: "Error de servidor" };
  }
}

export async function passwordResetService(email) {
  try {
    const data = await passwordResetRequest(email);
    if (data.message) {
      return { success: true };
    }
    return { success: false, error: data.detail || "Error" };
  } catch (err) {
    return { success: false, error: "Error de servidor" };
  }
}
