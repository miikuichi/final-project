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
  const { d1name, d1bday, d2name, d2bday, emerConName, emerConNum, ...employeeData } = employee;
  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData)
  });
  if (!res.ok) throw new Error('Failed to add employee');
  return await res.json();
}

// Update employee (send employeeId in URL, object in body)
export async function updateEmployee(employee) {
  const { d1name, d1bday, d2name, d2bday, emerConName, emerConNum, ...employeeData } = employee;
  const res = await fetch(`${API_URL}/update/${employee.employeeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData)
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

// Remove employee by first and last name
export async function removeEmployeeByName(firstName, lastName) {
  const res = await fetch(`${API_URL}/deleteByName?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete employee by name');
  return true;
}
