import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ICompanyManagerPermissions } from '../model/ICompanyManagerPermissions';
import { IEmployee } from '../model/IEmployee';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyManagerPermissions.css';
import CompanyManagerSidebar from '../components/organisms/CompanyManagerSidebar';
import { leaveId, LeaveStatusLabels, leaveTypes } from "../model/IPermissions";

const CompanyManagerPermissions: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [companyManagerPermissionRequests, setCompanyManagerPermissionRequests] = useState<ICompanyManagerPermissions[]>([]);
    const [newRequest, setNewRequest] = useState({
        employeeId: 0,
        startDate: "",
        endDate: "",
        leaveTypeId: "",
    });
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            fetchEmployees(); // Fetch employees based on companyId
        }
    }, [navigate]);

    // Fetch employees by companyId
    const fetchEmployees = () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setErrorMessage("Token bulunamadı, giriş yapmanız gerekiyor.");
            return;
        }

        fetch("http://localhost:9090/v1/dev/company-manager/employees/get-by-companyId", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setEmployees(data.data);
                } else {
                    setErrorMessage("Çalışanlar alınırken hata oluştu.");
                }
            })
            .catch((err) => {
                setErrorMessage("Çalışanları çekerken hata oluştu.");
            });
    };


    const saveEmployee = (employeeData: Record<string, any>) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setErrorMessage("Token bulunamadı, giriş yapmanız gerekiyor.");
            return;
        }

        const leaveData = {
            employeeId: employeeData.employeeId,
            leaveTypeId: leaveId[employeeData.leaveTypeId as keyof typeof leaveId], 
            startDate: employeeData.startDate,
            endDate: employeeData.endDate,
        };

        fetch("http://localhost:9090/v1/dev/company-manager/leaves/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(leaveData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setNewRequest({ employeeId: 0, startDate: "", endDate: "", leaveTypeId: "" });
                    setCompanyManagerPermissionRequests((prevRequests) => [
                        ...prevRequests,
                        data.data, // Yeni izin talebini ekliyoruz
                    ]);
                } else {
                    setErrorMessage("İzin talebi kaydedilirken hata oluştu.");
                }
            })
            .catch((err) => {
                setErrorMessage("İzin talebi kaydedilirken bir hata oluştu.");
            });
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setNewRequest({
            ...newRequest,
            [e.target.name]: e.target.name === "leaveTypeId" ? parseInt(value) : value,
        });
    };

    // Handle employee selection change
    const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEmployeeId = parseInt(e.target.value);
        setNewRequest({
            ...newRequest,
            employeeId: selectedEmployeeId,
        });
    };

    return (
        <div className={`deneme-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <div className="permissions-container">
                    <p className="header-subtitle">Şirket Yöneticisi olarak çalışanlarınıza izin atayabilirsiniz.</p>


                    <div className="new-request-form">
                        <p className="header-subtitle">Yeni İzin Talebi Ekle</p>
                        <select
                            name="employeeId"
                            value={newRequest.employeeId}
                            onChange={handleEmployeeChange} // Handle employee change
                        >
                            <option value={0}>Çalışan Seçin</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.firstName} {employee.lastName}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            name="startDate"
                            value={newRequest.startDate}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={newRequest.endDate}
                            onChange={handleInputChange}
                        />
                        <select
                            name="leaveTypeId"
                            value={newRequest.leaveTypeId}
                            onChange={handleInputChange}
                        >
                            <option value="">İzin Türü Seçin</option>
                            {Object.keys(leaveTypes).map((key) => (
                                <option key={key} value={key}>
                                    {leaveTypes[key as keyof typeof leaveTypes]}
                                </option>
                            ))}
                        </select>

                        <button onClick={() => saveEmployee(newRequest)}>Ekle</button>
                    </div>

                    <p className="header-subtitle">İzin Talepleri</p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Çalışan Adı</th>
                                <th>Başlangıç Tarihi</th>
                                <th>Bitiş Tarihi</th>
                                
                                <th>Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyManagerPermissionRequests.length > 0 ? (
                                companyManagerPermissionRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>
                                            {employees.find((employee) => employee.id === request.employeeId)?.firstName}{" "}
                                            {employees.find((employee) => employee.id === request.employeeId)?.lastName}
                                        </td>
                                        <td>{request.startDate}</td>
                                        <td>{request.endDate}</td>
                                        <td>{LeaveStatusLabels[request.status] ?? "Bilinmeyen Durum"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>İzin talebi bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </main>
        </div>
    );
};

export default CompanyManagerPermissions;
