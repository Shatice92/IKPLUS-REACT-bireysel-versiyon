import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/organisms/AdminSideBar';
import { useNavigate } from 'react-router';
import './AdminDefinitions.css';
import { IDefinitions, TypeLeaves } from '../model/IDefinitions';


function AdminDefinitions() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const [leaveTypes, setLeaveTypes] = useState<IDefinitions[]>([]);
    const [newLeaveType, setNewLeaveType] = useState('');
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:9090/v1/dev/admin/list-leave-types", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setLeaveTypes(data.data.map((leave: { id: number; leavesName: keyof typeof TypeLeaves }) => ({
                        id: leave.id,
                        leavesName: TypeLeaves[leave.leavesName] || leave.leavesName
                    })));
                }
            })
            .catch(error => console.error("İzin türleri çekilirken hata oluştu:", error));
    }, [token]);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const addLeaveType = () => {
        if (newLeaveType.trim()) {
            fetch("http://localhost:9090/v1/dev/admin/add-leave-type", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ leavesName: newLeaveType })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setLeaveTypes([...leaveTypes, {
                            id: data.data.id,
                            leavesName: TypeLeaves[data.data.leavesName as keyof typeof TypeLeaves] || data.data.leavesName
                        }]);
                        setNewLeaveType('');
                    }
                })
                .catch(error => console.error("İzin türü eklenirken hata oluştu:", error));
        }
    };

    return (
        <div className="deneme-container">
            <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <p className="header-subtitle">Site yöneticisi olarak burada izin türleri ve diğer temel tanımlamaları yapabilirsiniz.</p>
                <section className="leave-types-section">
                    <h2 className="section-title">İzin Türleri</h2>
                    <div className="leave-type-list">
                        <ul>
                            {leaveTypes.map((leaveType) => (
                                <li key={leaveType.id} className="leave-type-item">
                                    {leaveType.leavesName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="add-leave-type">
                        <input 
                            type="text" 
                            value={newLeaveType} 
                            onChange={(e) => setNewLeaveType(e.target.value)} 
                            placeholder="Yeni izin türü ekleyin" 
                        />
                        <button onClick={addLeaveType} className="btn btn-primary">Ekle</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDefinitions;