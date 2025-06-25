const API_URL = 'http://localhost:8080/api/employee';

export async function getEmployees() {
  const res = await fetch(`${API_URL}/all`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return await res.json();
}

export async function getEmployeeById(employeeId) {
  const res = await fetch(`${API_URL}/${employeeId}`);
  if (!res.ok) throw new Error('Employee not found');
  return await res.json();
}

export async function addEmployee(employee) {
  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });
  if (!res.ok) throw new Error('Failed to add employee');
  return await res.json();
}

export async function updateEmployee(employeeId, employee) {
  const res = await fetch(`${API_URL}/update/${employeeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return await res.json();
}

export async function removeEmployee(employeeId) {
  const res = await fetch(`${API_URL}/delete/${employeeId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete employee');
  return true;
}
