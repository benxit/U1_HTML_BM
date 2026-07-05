const API_URL = `${import.meta.env.VITE_API_URL}/coach`;

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getMyClasses() {
  const response = await fetch(`${API_URL}/my-classes`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener mis clases");
  return data;
}

export async function getMySchedules() {
  const response = await fetch(`${API_URL}/my-schedules`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener mi horario");
  return data;
}

export async function getMyRooms() {
  const response = await fetch(`${API_URL}/my-rooms`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener mis salas");
  return data;
}

export async function getCoachDashboard() {
  const response = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener el dashboard");
  return data;
}


