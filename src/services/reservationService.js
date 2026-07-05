const MEMBER_URL = `${import.meta.env.VITE_API_URL}/member`;
const RESERVATIONS_URL = `${import.meta.env.VITE_API_URL}/reservations`;

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// --- Clases disponibles (para el usuario) ---

export async function getAvailableClasses() {
  const response = await fetch(`${MEMBER_URL}/classes`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener clases disponibles");
  return data;
}

export async function getClassDetail(id) {
  const response = await fetch(`${MEMBER_URL}/classes/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener la clase");
  return data;
}

export async function getMemberDashboard() {
  const response = await fetch(`${MEMBER_URL}/dashboard`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener el dashboard");
  return data;
}

// --- Reservas ---

export async function getMyReservations() {
  const response = await fetch(`${RESERVATIONS_URL}/my-reservations`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al obtener mis reservas");
  return data;
}

export async function createReservation(payload) {
  const response = await fetch(RESERVATIONS_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al crear la reserva");
  return data;
}

export async function cancelReservation(id) {
  const response = await fetch(`${RESERVATIONS_URL}/${id}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al cancelar la reserva");
  return data;
}


