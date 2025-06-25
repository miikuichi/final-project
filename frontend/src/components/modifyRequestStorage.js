const API_URL = 'http://localhost:8080/api/modify-request';

export async function getModifyRequests() {
  const res = await fetch(`${API_URL}/all`);
  if (!res.ok) throw new Error('Failed to fetch modify requests');
  return await res.json();
}

export async function addModifyRequest(request) {
  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  if (!res.ok) throw new Error('Failed to add modify request');
  return await res.json();
}

export async function deleteModifyRequest(id) {
  const res = await fetch(`${API_URL}/delete/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete modify request');
  return true;
}

export async function getModifyRequestsByEmployee(employeeId) {
  const res = await fetch(`${API_URL}/employee/${employeeId}`);
  if (!res.ok) throw new Error('Failed to fetch modify requests for employee');
  return await res.json();
}

export async function getModifyRequestsByRequester(requestedBy) {
  const res = await fetch(`${API_URL}/requestedBy/${requestedBy}`);
  if (!res.ok) throw new Error('Failed to fetch modify requests by requester');
  return await res.json();
}
