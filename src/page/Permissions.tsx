import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Permissions.css";
import EmployeeSidebar from "../components/organisms/EmployeeSideBar";
import { IPermissions, leaveId, LeaveStatus, LeaveStatusLabels, leaveTypes } from "../model/IPermissions";

const Permissions = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [permissionRequests, setPermissionRequests] = useState<IPermissions[]>([]);
  const [newRequest, setNewRequest] = useState({ startDate: "", endDate: "", leaveTypeId: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Yeni izin verilerini almak için kullanılan fonksiyon
  const fetchPermissions = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    setLoading(true); // Yükleniyor durumu
    try {
      const response = await fetch("http://localhost:9090/v1/dev/employee/leaves/get-leave-by-employeeId", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPermissionRequests(data.data); // Gelen izin taleplerini state'e aktar
      } else {
        alert("İzin talepleri alınamadı.");
      }
    } catch (error) {
      console.error("İzin talebi hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    }
    setLoading(false); // Yükleniyor durumu sonlandır
  };

  // sayfa yüklendiğinde izin verilerini çekme
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchLeaveTypeId = async (leaveTypeName: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9090/v1/dev/employee/leaves/get-leavetypeId-by-leavetypename?leaveName=${leaveTypeName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data; // Backend'den gelen leaveTypeId
      } else {
        alert("İzin türü ID alınamadı. Lütfen tekrar deneyiniz.");
        return null;
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
      return null;
    }
  };

  const handleLeaveTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leavesName = e.target.value;

    if (leavesName) {
      setLoading(true);
      const leaveTypeId = await fetchLeaveTypeId(leavesName);
      setLoading(false);

      if (leaveTypeId !== null) {
        setNewRequest((prev) => ({
          ...prev,
          leaveTypeId: leaveTypeId.toString(), // leaveTypeId'yi state'e kaydediyoruz
        }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddRequest = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    if (!newRequest.leaveTypeId) {
      alert("Geçerli bir izin türü seçiniz.");
      return;
    }

    const requestBody: IPermissions = {
      leaveTypeId: parseInt(newRequest.leaveTypeId, 10),
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      status: LeaveStatus.PENDING,
    };

    try {
      const response = await fetch("http://localhost:9090/v1/dev/employee/leaves/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        const newPermission: IPermissions = responseData.data;

        if (!newPermission.leaveTypeId) {
          console.error("HATA: API'den dönen izin türü ID eksik!", newPermission);
        }

        alert("İzin talebi başarıyla gönderildi.");
        setPermissionRequests([...permissionRequests, newPermission]);
        setNewRequest({ startDate: "", endDate: "", leaveTypeId: "" });
      } else {
        alert("İzin talebi oluşturulamadı. Lütfen tekrar deneyiniz.");
      }
    } catch (error) {
      console.error("İzin talebi hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    }
  };

  return (
    <div className="deneme-container">
      <EmployeeSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <div className="permissions-container">
          <div className="header-left">
            <h1>Personel İzin Yönetimi</h1>
            <p className="header-subtitle">Yöneticinize izin taleplerinizi iletin ve onaylanmasını bekleyin.</p>
          </div>

          <div className="new-request-form">
            <label>
              İzin Başlangıç Tarihi:
              <input type="date" name="startDate" value={newRequest.startDate} onChange={handleInputChange} />
            </label>
            <br />
            <label>
              İzin Bitiş Tarihi:
              <input type="date" name="endDate" value={newRequest.endDate} onChange={handleInputChange} />
            </label>
            <br />
            <label>
              İzin Türü:
              <select name="leaveTypeId" value={newRequest.leaveTypeId} onChange={handleLeaveTypeChange}>
                <option value="">İzin Türü Seçin</option>
                {Object.entries(leaveTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </label>
            {loading && <p>İzin türü ID alınıyor...</p>}
            <button onClick={handleAddRequest}>Ekle</button>
          </div>

          <div className="requests-list">
            <span className="request-list-title">İzin Talep Listesi</span>
            <table>
              <thead>
                <tr>
                  <th>İzin Başlangıç Tarihi</th>
                  <th>İzin Bitiş Tarihi</th>
                  <th>İzin Türü</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {permissionRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Henüz izin talebi yapılmamış.</td>
                  </tr>
                ) : (
                  permissionRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.startDate}</td>
                      <td>{request.endDate}</td>
                      <td>{leaveId[request.leaveTypeId] || "Bilinmeyen İzin Türü"}</td> {/* Burada leaveId kullanılıyor */}
                      <td>{LeaveStatusLabels[request.status] ?? "Bilinmeyen Durum"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Permissions;
