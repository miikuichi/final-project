import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../components/RoleContext';
import { AdminNavBar, HRNavBar } from '../components/NavBar';
import { addEmployee } from '../components/employeeStorage';
import './AddEmployee.css';

const initialState = {
  image: '',
  lastName: '',
  firstName: '',
  middleInitial: '',
  suffix: '',
  birthday: '',
  cellphone: '',
  dateHired: '',
  religion: '',
  dependents: [
    { name: '', birthday: '' },
    { name: '', birthday: '' },
  ],
  email: { user: '', domain: '@gmail.com' },
  course: '',
  school: '',
  licenses: '',
  philhealth: '',
  sss: '',
  pagibig: '',
  tin: '',
  emergencyContact: { name: '', number: '' },
  bloodtype: '',
  department: '',
  position: '',
  permanentAddress: {
    house: '',
    barangay: '',
    city: '',
    province: '',
    zip: '',
  },
  currentAddress: {
    house: '',
    barangay: '',
    city: '',
    province: '',
    zip: '',
  },
  sameAsPermanent: false,
};

export default function AddEmployee() {
  const [form, setForm] = useState(initialState);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { role } = useRole();

  const handleChange = e => {
    const { name, value, type, checked, dataset } = e.target;
    if (name === 'sameAsPermanent') {
      setForm(f => ({
        ...f,
        sameAsPermanent: checked,
        currentAddress: checked ? { ...f.permanentAddress } : f.currentAddress,
      }));
    } else if (name === 'image') {
      setForm(f => ({ ...f, image: e.target.files[0] }));
    } else if (dataset.addrtype) {
      setForm(f => ({
        ...f,
        [dataset.addrtype]: {
          ...f[dataset.addrtype],
          [name]: value,
        },
      }));
      if (form.sameAsPermanent && dataset.addrtype === 'permanentAddress') {
        setForm(f => ({
          ...f,
          currentAddress: { ...f.permanentAddress, [name]: value },
        }));
      }
    } else if (name.startsWith('dependentName')) {
      const idx = parseInt(name.replace('dependentName', ''));
      setForm(f => {
        const dependents = [...f.dependents];
        dependents[idx].name = value;
        return { ...f, dependents };
      });
    } else if (name.startsWith('dependentBirthday')) {
      const idx = parseInt(name.replace('dependentBirthday', ''));
      setForm(f => {
        const dependents = [...f.dependents];
        dependents[idx].birthday = value;
        return { ...f, dependents };
      });
    } else if (name === 'emailUser') {
      setForm(f => ({ ...f, email: { ...f.email, user: value } }));
    } else if (name === 'emailDomain') {
      setForm(f => ({ ...f, email: { ...f.email, domain: value } }));
    } else if (name.startsWith('emergency')) {
      setForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, [name.replace('emergency', '').toLowerCase()]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const validateEmail = () => {
    const email = form.email.user + form.email.domain;
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!re.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleClear = () => {
    setForm(initialState);
    setShowClearModal(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateEmail()) return;
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    addEmployee({
      ...form,
      email: form.email.user + form.email.domain,
      dependents: JSON.stringify(form.dependents),
      emergencyContact: JSON.stringify(form.emergencyContact),
    });
    setForm(initialState);
    setShowConfirmModal(false);
    alert('Employee added successfully!');
    navigate(-1); // Go back to previous page
  };

  return (
    <div>
      {role === 'admin' ? (
        <AdminNavBar onHome={() => window.location.assign('/admin')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      ) : (
        <HRNavBar onHome={() => window.location.assign('/hr')} onIssueTicket={() => window.location.assign('/issue-ticket')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      )}
      <div className="add-employee-container wide" style={{margin:'1rem auto', maxWidth:900}}>
        <h2>Add Employee</h2>
        <form className="add-employee-form" onSubmit={handleSubmit}>
          <div className="form-row image-name-row">
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="image-label">Image</label>
              <div className="image-preview-box">
                {form.image ? (
                  <img src={URL.createObjectURL(form.image)} alt="Employee" className="preview-img-large" />
                ) : (
                  <span className="image-placeholder">No Image</span>
                )}
              </div>
              <div className="image-upload-center">
                <input id="image-upload" type="file" name="image" accept="image/*" onChange={handleChange} />
              </div>
            </div>
            <div className="name-flexbox">
              <div className="form-row single-field-row">
                <label>Last Name:</label>
                <input id="lastName" className="ae-textbox" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <div className="form-row single-field-row">
                <label>First Name:</label>
                <input id="firstName" className="ae-textbox" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="form-row mi-suffix-row-inline">
                <label style={{marginRight: '0.5rem'}}>M.I.:</label>
                <input id="middleInitial" className="ae-textbox" name="middleInitial" value={form.middleInitial} onChange={handleChange} maxLength={1} style={{width:'3.5rem', marginRight: '1.5rem'}} />
                <label style={{marginRight: '0.5rem'}}>Suffix:</label>
                <select name="suffix" value={form.suffix} onChange={handleChange} style={{minWidth:'80px'}}>
                  <option value="">--</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                </select>
              </div>
              <div className="form-row single-field-row">
                <label>Birthday</label>
                <input type="date" className="ae-textbox" name="birthday" value={form.birthday} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="form-row address-row">
            <label className="address-label">Permanent Address:</label>
          </div>
          <div className="form-row address-fields-row">
            <input id="house-perm" className="ae-textbox" name="house" data-addrtype="permanentAddress" placeholder="House/Building No." value={form.permanentAddress.house} onChange={handleChange} required />
            <input id="barangay-perm" className="ae-textbox" name="barangay" data-addrtype="permanentAddress" placeholder="Barangay" value={form.permanentAddress.barangay} onChange={handleChange} required />
            <input id="city-perm" className="ae-textbox" name="city" data-addrtype="permanentAddress" placeholder="Municipality/City" value={form.permanentAddress.city} onChange={handleChange} required />
            <input id="province-perm" className="ae-textbox" name="province" data-addrtype="permanentAddress" placeholder="Province" value={form.permanentAddress.province} onChange={handleChange} required />
            <input id="zip-perm" className="ae-textbox" name="zip" data-addrtype="permanentAddress" placeholder="ZIP Code" value={form.permanentAddress.zip} onChange={handleChange} required style={{width:'6rem'}} />
          </div>
          <div className="form-row address-row">
            <label className="address-label">Current Address:</label>
          </div>
          <div className="form-row address-fields-row">
            <input id="house-curr" className="ae-textbox" name="house" data-addrtype="currentAddress" placeholder="House/Building No." value={form.sameAsPermanent ? form.permanentAddress.house : form.currentAddress.house} onChange={handleChange} required disabled={form.sameAsPermanent} />
            <input id="barangay-curr" className="ae-textbox" name="barangay" data-addrtype="currentAddress" placeholder="Barangay" value={form.sameAsPermanent ? form.permanentAddress.barangay : form.currentAddress.barangay} onChange={handleChange} required disabled={form.sameAsPermanent} />
            <input id="city-curr" className="ae-textbox" name="city" data-addrtype="currentAddress" placeholder="Municipality/City" value={form.sameAsPermanent ? form.permanentAddress.city : form.currentAddress.city} onChange={handleChange} required disabled={form.sameAsPermanent} />
            <input id="province-curr" className="ae-textbox" name="province" data-addrtype="currentAddress" placeholder="Province" value={form.sameAsPermanent ? form.permanentAddress.province : form.currentAddress.province} onChange={handleChange} required disabled={form.sameAsPermanent} />
            <input id="zip-curr" className="ae-textbox" name="zip" data-addrtype="currentAddress" placeholder="ZIP Code" value={form.sameAsPermanent ? form.permanentAddress.zip : form.currentAddress.zip} onChange={handleChange} required disabled={form.sameAsPermanent} style={{width:'6rem'}} />
          </div>
          <div className="form-row checkbox-row">
            <label className="checkbox-label">
              <input type="checkbox" name="sameAsPermanent" checked={form.sameAsPermanent} onChange={handleChange} /> Similar with permanent address
            </label>
          </div>
          <div className="form-row">
            <label>Cellphone:</label>
            <input name="cellphone" className="ae-textbox" value={form.cellphone} onChange={handleChange} required />
            <label>Date Hired:</label>
            <input type="date" name="dateHired" className="ae-textbox" value={form.dateHired} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Religion:</label>
            <input name="religion" className="ae-textbox" value={form.religion} onChange={handleChange} />
            <label>Bloodtype:</label>
            <input name="bloodtype" className="ae-textbox" value={form.bloodtype} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Department:</label>
            <input name="department" className="ae-textbox" value={form.department} onChange={handleChange} required />
            <label>Position Title:</label>
            <input name="position" className="ae-textbox" value={form.position} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Course:</label>
            <input name="course" className="ae-textbox" value={form.course} onChange={handleChange} />
            <label>School:</label>
            <input name="school" className="ae-textbox" value={form.school} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Licenses:</label>
            <input name="licenses" className="ae-textbox" value={form.licenses} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>PhilHealth:</label>
            <input name="philhealth" className="ae-textbox" value={form.philhealth} onChange={handleChange} />
            <label>SSS:</label>
            <input name="sss" className="ae-textbox" value={form.sss} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Pag-IBIG:</label>
            <input name="pagibig" className="ae-textbox" value={form.pagibig} onChange={handleChange} />
            <label>TIN:</label>
            <input name="tin" className="ae-textbox" value={form.tin} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Emergency Contact Name:</label>
            <input name="emergencyName" className="ae-textbox" value={form.emergencyContact.name} onChange={handleChange} required />
            <label>Number:</label>
            <input name="emergencyNumber" className="ae-textbox" value={form.emergencyContact.number} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Email:</label>
            <input name="emailUser" className="ae-textbox" value={form.email.user} onChange={handleChange} required style={{width:'180px'}} />
            <select name="emailDomain" value={form.email.domain} onChange={handleChange} style={{width:'120px'}}>
              <option value="@gmail.com">@gmail.com</option>
              <option value="@yahoo.com">@yahoo.com</option>
              <option value="@outlook.com">@outlook.com</option>
              <option value="@company.com">@company.com</option>
            </select>
            {emailError && <span className="error-msg">{emailError}</span>}
          </div>
          <div className="form-row">
            <label>Dependents:</label>
            <input name="dependentName0" className="ae-textbox" placeholder="Name 1" value={form.dependents[0].name} onChange={handleChange} style={{width:'140px'}} />
            <input name="dependentBirthday0" type="date" className="ae-textbox" value={form.dependents[0].birthday} onChange={handleChange} style={{width:'140px'}} />
            <input name="dependentName1" className="ae-textbox" placeholder="Name 2" value={form.dependents[1].name} onChange={handleChange} style={{width:'140px'}} />
            <input name="dependentBirthday1" type="date" className="ae-textbox" value={form.dependents[1].birthday} onChange={handleChange} style={{width:'140px'}} />
          </div>
          <div className="form-actions">
            <button type="button" className="clear-btn" onClick={() => setShowClearModal(true)}>Clear</button>
            <button type="submit" className="add-btn">Add Employee</button>
          </div>
        </form>
        {showClearModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Clear Form</h3>
              <p>Clearing this form will remove all input data. Are you sure?</p>
              <div className="modal-actions">
                <button onClick={handleClear}>Yes</button>
                <button onClick={() => setShowClearModal(false)}>No</button>
              </div>
            </div>
          </div>
        )}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setShowConfirmModal(false)}>&times;</button>
              <h3>Confirm Employee Details</h3>
              <div className="confirm-details">
                {form.image && <img src={URL.createObjectURL(form.image)} alt="Employee" className="preview-img" />}
                <div><b>Name:</b> {form.lastName}, {form.firstName} {form.middleInitial && form.middleInitial + '.'} {form.suffix}</div>
                <div><b>Birthday:</b> {form.birthday}</div>
                <div><b>Cellphone:</b> {form.cellphone}</div>
                <div><b>Date Hired:</b> {form.dateHired}</div>
                <div><b>Religion:</b> {form.religion}</div>
                <div><b>Bloodtype:</b> {form.bloodtype}</div>
                <div><b>Department:</b> {form.department}</div>
                <div><b>Position:</b> {form.position}</div>
                <div><b>Course:</b> {form.course}</div>
                <div><b>School:</b> {form.school}</div>
                <div><b>Licenses:</b> {form.licenses}</div>
                <div><b>PhilHealth:</b> {form.philhealth}</div>
                <div><b>SSS:</b> {form.sss}</div>
                <div><b>Pag-IBIG:</b> {form.pagibig}</div>
                <div><b>TIN:</b> {form.tin}</div>
                <div><b>Emergency Contact:</b> {form.emergencyContact.name} ({form.emergencyContact.number})</div>
                <div><b>Email:</b> {form.email.user}{form.email.domain}</div>
                <div><b>Dependents:</b> {form.dependents.filter(d=>d.name||d.birthday).length === 0 ? 'None' : form.dependents.map((d,i) => d.name ? `${d.name} (${d.birthday})` : null).filter(Boolean).join(', ')}</div>
                <div><b>Permanent Address:</b> {Object.values(form.permanentAddress).filter(Boolean).join(', ')}</div>
                <div><b>Current Address:</b> {Object.values(form.currentAddress).filter(Boolean).join(', ')}</div>
              </div>
              <button className="confirm-btn" onClick={handleConfirm} style={{float:'right'}}>Confirm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
