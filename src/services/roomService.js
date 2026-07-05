const API_URL = `${import.meta.env.VITE_API_URL}/rooms`;

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getRooms() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener salas");
  return data;
}

export async function getRoomById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener la sala");
  return data;
}

export async function createRoom(roomData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(roomData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al crear sala");
  return data;
}

export async function updateRoom(id, roomData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(roomData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al actualizar sala");
  return data;
}

export async function deleteRoom(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al eliminar sala");
  return data;
}


