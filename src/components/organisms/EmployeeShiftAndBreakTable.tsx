import React, { useEffect, useState } from "react";
import { IShift, IBreak, ShiftTypeLabels, BreakNameLabels } from "../../model/IShiftAndBreak";

const EmployeeShiftAndBreakTable: React.FC = () => {
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [breaks, setBreaks] = useState<IBreak[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:9090/v1/dev/employee/shifts/get-shift-by-employeeId", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setShifts(data.data);
          } else {
            setErrorMessage(data.message || "Vardiyalar yüklenirken hata oluştu.");
          }
        })
        .catch((error) => {
          console.error("Vardiyalar alınırken hata oluştu:", error);
          setErrorMessage("Vardiyalar alınırken bir hata oluştu.");
        });

      fetch("http://localhost:9090/v1/dev/employee/breaks/get-break-by-employeeId", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setBreaks(data.data);
          } else {
            setErrorMessage(data.message || "Molalar yüklenirken hata oluştu.");
          }
        })
        .catch((error) => {
          console.error("Molalar alınırken hata oluştu:", error);
          setErrorMessage("Molalar alınırken bir hata oluştu.");
        });
    } else {
      setErrorMessage("Geçersiz veya eksik token!");
    }
  }, []);

  return (
    <div className="container">
      <div className="header-left">
        <h1>Personel Vardiya ve Mola Yönetimi</h1>
        <p className="header-subtitle">Tarafınıza atanmış vardiya ve molalarınızı görüntüleyin</p>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="table-wrapper">

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Vardiya Türü</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>

            </tr>
          </thead>
          <tbody>
            {shifts.length > 0 ? (
              shifts.map((shift) => (
                <tr key={shift.id}>
                  <td>{ShiftTypeLabels[shift.shiftType]}</td>
                  <td>{new Date(shift.startTime).toLocaleString()}</td>
                  <td>{new Date(shift.endTime).toLocaleString()}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Vardiya bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Mola Türü</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>

            </tr>
          </thead>
          <tbody>
            {breaks.length > 0 ? (
              breaks.map((brk) => (
                <tr key={brk.id}>
                  <td>{BreakNameLabels[brk.breakName]}</td>
                  <td>{new Date(brk.startTime).toLocaleString()}</td>
                  <td>{new Date(brk.endTime).toLocaleString()}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Mola bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeShiftAndBreakTable;
