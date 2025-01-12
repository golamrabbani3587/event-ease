const API_URL = "https://event-api.begelled.com/api";

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("token", data.token);
  } else {
    throw new Error(data.error || "Login failed");
  }
};

export const registerUser = async (userDetails) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDetails),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error || "Registration failed");
  }
};

export const getUserEvents = async () => {
  console.log("trying to get user data");

  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/events/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();
  return data;
};

export const joinEvent = async (eventId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/events/${eventId}/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to join event");
  }

  return await response.json();
};

export const createEvent = async (eventData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return await response.json();
};

export const deleteEvent = async (eventId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
};

export const updateEvent = async (eventId, eventData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return await response.json();
};
