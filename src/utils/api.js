const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFile = false
) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  if (!isFile && body) headers["Content-Type"] = "application/json";

  const config = {
    method,
    headers,
    body: isFile ? body : body ? JSON.stringify(body) : null,
  };

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error API");
  return data;
};
