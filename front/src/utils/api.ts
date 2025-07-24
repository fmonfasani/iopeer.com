// utils/api.ts o directamente dentro de tu componente
export async function loginUser(email: string, password: string) {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Error al iniciar sesión");
    }

    // Guardar token si viene en la respuesta
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
