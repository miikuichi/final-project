// Utility for managing employees via Spring Boot backend
const API_URL = 'http://localhost:8080/api/employees';

export async function getEmployees() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return await res.json();
}

export async function saveEmployee(employee) {
  // PUT to /api/employees/{employeeId}
  const res = await fetch(`${API_URL}/${employee.employeeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return await res.json();
}

export async function addEmployee(employee) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });
  if (!res.ok) throw new Error('Failed to add employee');
  return await res.json();
}

export async function removeEmployee(employeeId) {
  const res = await fetch(`${API_URL}/${employeeId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete employee');
}
