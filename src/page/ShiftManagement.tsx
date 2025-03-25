import React, { useState, useEffect } from "react";
import "./ShiftManagement.css";
import { IShiftManagement, SHIFTTYPE } from '../model/IShiftManagement';
import CompanyManagerSidebar from "../components/organisms/CompanyManagerSidebar";
import { IEmployee } from "../model/IEmployee";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState<IShiftManagement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [newShift, setNewShift] = useState<IShiftManagement>({
    id: 0,
    startTime: "",
    endTime: "",
    employeeId: "",
    shiftType: SHIFTTYPE.FULL_SHIFT,
  });
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  
  const fetchEmployees = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setErrorMessage('Token bulunamadı, giriş yapmanız gerekiyor.');
      return;
    }

    fetch('http://localhost:9090/v1/dev/company-manager/employees/get-by-companyId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmployees(data.data);
        } else {
          setErrorMessage('Çalışanlar alınırken hata oluştu.');
        }
      })
      .catch(() => {
        setErrorMessage('Çalışanları çekerken hata oluştu.');
      });
  };

  useEffect(() => {
    fetchEmployees();
    fetchShifts();
  }, []);

  // Vardiyaları API'den çek
  const fetchShifts = () => {
    fetch("http://localhost:9090/v1/dev/company-manager/shifts/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShifts(data))
      .catch((err) => console.error("Vardiyaları çekerken hata oluştu:", err));
  };

  const addShift = () => {
    fetch("http://localhost:9090/v1/dev/company-manager/shifts/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(newShift),
    })
      .then((res) => res.json())
      .then(() => {
        fetchShifts();
        setNewShift({ id: 0, startTime: "", endTime: "", employeeId: "", shiftType: SHIFTTYPE.FULL_SHIFT });
      })
      .catch((err) => console.error("Vardiya eklenirken hata oluştu:", err));
  };

  const deleteShift = (id: number) => {
    fetch(`http://localhost:9090/v1/dev/company-manager/shifts/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then(() => fetchShifts())
      .catch((err) => console.error("Vardiya silinirken hata oluştu:", err));
  };

  const editShift = (shift: IShiftManagement) => {
    setNewShift(shift);
    setEditingShiftId(shift.id);
  };

  return (
    <div className="shift-management-container">
      <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="shift-management">
          <p className="header-subtitle">Şirket Yöneticisi olarak çalışanlarınıza vardiya atayabilirsiniz.</p>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="shift-form">
            <div className="form-group">
              <label>Başlangıç Zamanı</label>
              <input
                type="datetime-local"
                value={newShift.startTime}
                onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Bitiş Zamanı</label>
              <input
                type="datetime-local"
                value={newShift.endTime}
                onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Çalışan Seç</label>
              <select value={newShift.employeeId} onChange={(e) => setNewShift({ ...newShift, employeeId: e.target.value })}>
                <option value="">Çalışan Seç</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Vardiya Tipi</label>
              <select value={newShift.shiftType} onChange={(e) => setNewShift({ ...newShift, shiftType: e.target.value as SHIFTTYPE })}>
                {Object.values(SHIFTTYPE).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <button className="add-shift-btn" onClick={addShift}>Vardiya Ata</button>
          </div>

          <div className="shift-list">
            <p className="header-subtitle">Mevcut Vardiyalar</p>
            <ul>
              {shifts.map((shift) => {
                const employee = employees.find(emp => emp.id === Number(shift.employeeId));
                return (
                  <li key={shift.id} className="shift-item">
                    <span>{shift.startTime} - {shift.endTime} | {employee ? `${employee.firstName} ${employee.lastName}` : "Bilinmeyen Çalışan"} | {shift.shiftType}</span>
                    <div className="shift-actions">
                      <button className="edit-btn" onClick={() => editShift(shift)}>Düzenle</button>
                      <button className="delete-btn" onClick={() => deleteShift(shift.id)}>Sil</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShiftManagement;
