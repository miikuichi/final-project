import React, { useState, useEffect } from 'react';
import { useRole } from '../components/RoleContext';
import { AdminNavBar, HRNavBar } from '../components/NavBar';
import { getEmployees, addEmployee } from '../components/employeeStorage';

export default function ManageEmployee() {
  const { role } = useRole();
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmp, setNewEmp] = useState({
    employeeId: '',
    lastName: '',
    firstName: '',
    middleInitial: '',
    suffix: '',
    birthday: '',
    permanentAddress: { house: '', barangay: '', city: '', province: '', zip: '' },
    currentAddress: { house: '', barangay: '', city: '', province: '', zip: '' },
    image: ''
  });
  const [editEmp, setEditEmp] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const emps = getEmployees();
    setEmployees(emps);
    setFiltered(emps);
  }, [showAdd]);

  useEffect(() => {
    if (!search) {
      setFiltered(employees);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        employees.filter(e =>
          (e.employeeId && e.employeeId.toLowerCase().includes(s)) ||
          (e.lastName && e.lastName.toLowerCase().includes(s)) ||
          (e.firstName && e.firstName.toLowerCase().includes(s))
        )
      );
    }
  }, [search, employees]);

  const handleAdd = e => {
    e.preventDefault();
    addEmployee(newEmp);
    setShowAdd(false);
    setNewEmp({
      employeeId: '', lastName: '', firstName: '', middleInitial: '', suffix: '', birthday: '',
      permanentAddress: { house: '', barangay: '', city: '', province: '', zip: '' },
      currentAddress: { house: '', barangay: '', city: '', province: '', zip: '' },
      image: ''
    });
  };

  return (
    <div>
      {role === 'admin' ? (
        <AdminNavBar onHome={() => window.location.assign('/admin')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      ) : (
        <HRNavBar onHome={() => window.location.assign('/hr')} onIssueTicket={() => window.location.assign('/issue-ticket')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      )}
      <div className="manage-employee-container" style={{minWidth: '400px',width: '40vw', height: '90vh', minHeight: '600px', maxWidth: 'none' }}>
        <div className="search-bar-row" style={{ justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <input
            className="search-bar"
            type="text"
            placeholder="Search by Employee ID or Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button className="add-btn" style={{ marginLeft: 16 }} onClick={() => setShowAdd(true)}>Add Test Employee</button>
        </div>
        <div className="employee-list">
          {filtered.length === 0 && <div className="no-employees">No employees found.</div>}
          {filtered.map(emp => (
            <div className="employee-card" key={emp.employeeId || emp.lastName + emp.firstName}>
              <div className="employee-card-content">
                <div className="employee-card-img">
                  {emp.image ? (
                    <img src={typeof emp.image === 'string' ? emp.image : URL.createObjectURL(emp.image)} alt="Employee" className="card-img-thumb" />
                  ) : (
                    <div className="card-img-placeholder">?</div>
                  )}
                </div>
                <div className="employee-card-main">
                  <span className="employee-name">{emp.lastName}, {emp.firstName}</span>
                  <span className="employee-id">ID: {emp.employeeId || 'N/A'}</span>
                </div>
              </div>
              <button className="show-details-btn" onClick={() => setSelected(emp)}>Show full details</button>
            </div>
          ))}
        </div>
        {selected && (
          <div className="modal-overlay">
            <div className="modal employee-modal">
              <button className="close-btn" onClick={() => setSelected(null)}>&times;</button>
              <h3>Employee Details</h3>
              <div className="employee-details">
                {selected.image && (
                  <img src={typeof selected.image === 'string' ? selected.image : URL.createObjectURL(selected.image)} alt="Employee" className="preview-img" />
                )}
                <div><b>Name:</b> {selected.lastName}, {selected.firstName} {selected.middleInitial && selected.middleInitial + '.'} {selected.suffix}</div>
                <div><b>Employee ID:</b> {selected.employeeId || 'N/A'}</div>
                <div><b>Birthday:</b> {selected.birthday}</div>
                <div><b>Permanent Address:</b> {selected.permanentAddress && Object.values(selected.permanentAddress).filter(Boolean).join(', ')}</div>
                <div><b>Current Address:</b> {selected.currentAddress && Object.values(selected.currentAddress).filter(Boolean).join(', ')}</div>
              </div>
              <button className="modify-btn" onClick={() => { setEditEmp(selected); setSelected(null); }}>Modify</button>
            </div>
          </div>
        )}
        {showAdd && (
          <div className="modal-overlay">
            <div className="modal employee-modal">
              <button className="close-btn" onClick={() => setShowAdd(false)}>&times;</button>
              <h3>Add Test Employee</h3>
              <form onSubmit={handleAdd} className="add-employee-form" style={{gap:'0.7rem'}}>
                <input className="ae-textbox" placeholder="Employee ID" value={newEmp.employeeId} onChange={e => setNewEmp(emp => ({...emp, employeeId: e.target.value}))} required />
                <input className="ae-textbox" placeholder="Last Name" value={newEmp.lastName} onChange={e => setNewEmp(emp => ({...emp, lastName: e.target.value}))} required />
                <input className="ae-textbox" placeholder="First Name" value={newEmp.firstName} onChange={e => setNewEmp(emp => ({...emp, firstName: e.target.value}))} required />
                <input className="ae-textbox" placeholder="M.I." value={newEmp.middleInitial} maxLength={1} onChange={e => setNewEmp(emp => ({...emp, middleInitial: e.target.value}))} />
                <input className="ae-textbox" placeholder="Suffix" value={newEmp.suffix} onChange={e => setNewEmp(emp => ({...emp, suffix: e.target.value}))} />
                <input className="ae-textbox" type="date" placeholder="Birthday" value={newEmp.birthday} onChange={e => setNewEmp(emp => ({...emp, birthday: e.target.value}))} />
                <input className="ae-textbox" placeholder="Permanent Address (comma separated)" value={Object.values(newEmp.permanentAddress).filter(Boolean).join(', ')} onChange={e => setNewEmp(emp => ({...emp, permanentAddress: (() => { const vals = e.target.value.split(',').map(v=>v.trim()); return { house: vals[0]||'', barangay: vals[1]||'', city: vals[2]||'', province: vals[3]||'', zip: vals[4]||'' }; })() }))} />
                <input className="ae-textbox" placeholder="Current Address (comma separated)" value={Object.values(newEmp.currentAddress).filter(Boolean).join(', ')} onChange={e => setNewEmp(emp => ({...emp, currentAddress: (() => { const vals = e.target.value.split(',').map(v=>v.trim()); return { house: vals[0]||'', barangay: vals[1]||'', city: vals[2]||'', province: vals[3]||'', zip: vals[4]||'' }; })() }))} />
                <button className="add-btn" type="submit">Add</button>
              </form>
            </div>
          </div>
        )}
        {editEmp && (
          <div className="modal-overlay">
            <div className="modal employee-modal">
              <button className="close-btn" onClick={() => setEditEmp(null)}>&times;</button>
              <h3>Edit Employee</h3>
              <form onSubmit={e => {
                e.preventDefault();
                // Save changes as a modification request instead of direct update
                const updated = { ...editEmp };
                if (!reason) return; // require reason
                const requests = JSON.parse(localStorage.getItem('modifyRequests') || '[]');
                requests.push({
                  employeeId: updated.employeeId,
                  updated,
                  reason,
                  requestedBy: role,
                  date: new Date().toISOString()
                });
                localStorage.setItem('modifyRequests', JSON.stringify(requests));
                setEditEmp(null);
                setReason('');
                alert('Modification request sent to admin.');
              }} className="add-employee-form" style={{gap:'0.7rem'}}>
                <input className="ae-textbox" placeholder="Employee ID" value={editEmp.employeeId} disabled />
                <input className="ae-textbox" placeholder="Last Name" value={editEmp.lastName} onChange={e => setEditEmp(emp => ({...emp, lastName: e.target.value}))} required />
                <input className="ae-textbox" placeholder="First Name" value={editEmp.firstName} onChange={e => setEditEmp(emp => ({...emp, firstName: e.target.value}))} required />
                <input className="ae-textbox" placeholder="M.I." value={editEmp.middleInitial} maxLength={1} onChange={e => setEditEmp(emp => ({...emp, middleInitial: e.target.value}))} />
                <input className="ae-textbox" placeholder="Suffix" value={editEmp.suffix} onChange={e => setEditEmp(emp => ({...emp, suffix: e.target.value}))} />
                <input className="ae-textbox" type="date" placeholder="Birthday" value={editEmp.birthday} onChange={e => setEditEmp(emp => ({...emp, birthday: e.target.value}))} />
                <input className="ae-textbox" placeholder="Permanent Address (comma separated)" value={Object.values(editEmp.permanentAddress).filter(Boolean).join(', ')} onChange={e => setEditEmp(emp => ({...emp, permanentAddress: (() => { const vals = e.target.value.split(',').map(v=>v.trim()); return { house: vals[0]||'', barangay: vals[1]||'', city: vals[2]||'', province: vals[3]||'', zip: vals[4]||'' }; })() }))} />
                <input className="ae-textbox" placeholder="Current Address (comma separated)" value={Object.values(editEmp.currentAddress).filter(Boolean).join(', ')} onChange={e => setEditEmp(emp => ({...emp, currentAddress: (() => { const vals = e.target.value.split(',').map(v=>v.trim()); return { house: vals[0]||'', barangay: vals[1]||'', city: vals[2]||'', province: vals[3]||'', zip: vals[4]||'' }; })() }))} />
                <textarea className="ae-textbox" placeholder="Reason for change (required)" value={reason} onChange={e => setReason(e.target.value)} required style={{minHeight:'60px'}} />
                <button className="add-btn" type="submit">Send Request</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
