// API Client for ServiceHub Pro

const API_BASE = "/api";

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============= AUTH API =============

export async function checkPhoneExists(phone: string) {
  return fetchAPI("/auth/phone", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function registerCustomer(data: any) {
  return fetchAPI("/auth/register/customer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerWorker(data: any) {
  return fetchAPI("/auth/register/worker", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============= SERVICES API =============

export async function getAllServices() {
  return fetchAPI("/services");
}

export async function getService(id: number) {
  return fetchAPI(`/services/${id}`);
}

export async function createService(data: any) {
  return fetchAPI("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateService(id: number, data: any) {
  return fetchAPI(`/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteService(id: number) {
  return fetchAPI(`/services/${id}`, {
    method: "DELETE",
  });
}

// ============= BOOKINGS API =============

export async function createBooking(data: any) {
  return fetchAPI("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCustomerBookings(customerId: number) {
  return fetchAPI(`/bookings/customer/${customerId}`);
}

export async function getWorkerBookings(workerId: number) {
  return fetchAPI(`/bookings/worker/${workerId}`);
}

export async function getBooking(id: number) {
  return fetchAPI(`/bookings/${id}`);
}

export async function updateBooking(id: number, data: any) {
  return fetchAPI(`/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============= USERS API =============

export async function getAllUsers() {
  return fetchAPI("/users");
}

export async function getUser(id: number) {
  return fetchAPI(`/users/${id}`);
}

// ============= WORKERS API =============

export async function getAllWorkers() {
  return fetchAPI("/workers");
}

export async function getWorkerDetails(userId: number) {
  return fetchAPI(`/workers/${userId}`);
}

export async function updateWorkerDetails(userId: number, data: any) {
  return fetchAPI(`/workers/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============= NOTIFICATIONS API =============

export async function getUserNotifications(userId: number) {
  return fetchAPI(`/notifications/${userId}`);
}

export async function markNotificationRead(id: number) {
  return fetchAPI(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

// ============= ADMIN API =============

export async function getAdminStats() {
  return fetchAPI("/admin/stats");
}
