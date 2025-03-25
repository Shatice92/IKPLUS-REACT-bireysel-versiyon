import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form } from "antd";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import './AdminCompanyManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminSidebar from "../components/organisms/AdminSideBar";
import { ICompany, CompanyStatus, CompanyStatusLabels } from "../model/ICompany";

const AdminCompanyManagement: React.FC = () => {
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<ICompany | null>(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmailDomain, setUpdatedEmailDomain] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setErrorMessage("Geçersiz veya eksik token!");
            return;
        }

        fetch("http://localhost:9090/v1/dev/admin/companies/list", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) setCompanies(data.data);
                else setErrorMessage(data.message || "API Response Error");
            })
            .catch((error) => setErrorMessage(error.message));
    };

    const handleApprove = (id: number) => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:9090/v1/dev/admin/companies/approve/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    setCompanies((prevCompanies) =>
                        prevCompanies.map((company) =>
                            company.id === id ? { ...company, status: CompanyStatus.APPROVED } : company
                        )
                    );
                    Swal.fire({
                        title: "Başarılı",
                        text: "Şirket onay durumu güncellendi!",
                        icon: "success",
                        confirmButtonText: "Tamam",
                    });
                } else {
                    Swal.fire({
                        title: "Hata",
                        text: "Şirket onaylanırken bir hata oluştu.",
                        icon: "error",
                        confirmButtonText: "Tamam",
                    });
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: "Hata",
                    text: "Bir hata oluştu. Lütfen tekrar deneyin.",
                    icon: "error",
                    confirmButtonText: "Tamam",
                });
            });
    };

    const handleReject = (id: number) => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:9090/v1/dev/admin/companies/reject/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== id));
                    Swal.fire({
                        title: "Başarılı",
                        text: "Şirket reddedildi!",
                        icon: "success",
                        confirmButtonText: "Tamam",
                    });
                } else {
                    Swal.fire({
                        title: "Hata",
                        text: "Şirket reddedilirken bir hata oluştu.",
                        icon: "error",
                        confirmButtonText: "Tamam",
                    });
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: "Hata",
                    text: "Bir hata oluştu. Lütfen tekrar deneyin.",
                    icon: "error",
                    confirmButtonText: "Tamam",
                });
            });
    };

    const handleUpdateCompany = () => {
        const token = sessionStorage.getItem("token");
        if (!token || !currentCompany) return;

        const updatedCompanyData = {
            name: updatedName,
            emailDomain: updatedEmailDomain,
        };

        fetch(`http://localhost:9090/v1/dev/admin/companies/update/${currentCompany.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedCompanyData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    setCompanies((prevCompanies) =>
                        prevCompanies.map((company) =>
                            company.id === currentCompany.id ? { ...company, ...updatedCompanyData } : company
                        )
                    );
                    setIsModalVisible(false);
                    Swal.fire({
                        title: "Başarılı",
                        text: "Şirket başarıyla güncellendi!",
                        icon: "success",
                        confirmButtonText: "Tamam",
                    });
                } else {
                    Swal.fire({
                        title: "Hata",
                        text: "Şirket güncellenirken bir hata oluştu.",
                        icon: "error",
                        confirmButtonText: "Tamam",
                    });
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: "Hata",
                    text: "Bir hata oluştu. Lütfen tekrar deneyin.",
                    icon: "error",
                    confirmButtonText: "Tamam",
                });
            });
    };

    const handleEditCompany = (company: ICompany) => {
        setCurrentCompany(company);
        setUpdatedName(company.name);
        setUpdatedEmailDomain(company.emailDomain);
        setIsModalVisible(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Şirket Adı", dataIndex: "name", key: "name" },
        { title: "E-Posta Domaini", dataIndex: "emailDomain", key: "emailDomain" },
        {
            title: "Logo",
            dataIndex: "logo",
            key: "logo",
            render: (logo: string) => <img src={logo} alt="Şirket Logosu" width={50} height={50} />
        },
        {
            title: "Onay Durumu", dataIndex: "status", key: "status",
            render: (status: CompanyStatus) => (
                <span>{CompanyStatusLabels[status]}</span>
            )
        },
      
        {
            title: "İşlemler", render: (_: any, record: ICompany) => (
                <div>
                    <Button onClick={() => handleApprove(record.id)} type="primary" style={{ marginRight: 10 }}>Onayla</Button>
                    <Button onClick={() => handleEditCompany(record)} type="default" style={{ marginRight: 10 }}>Güncelle</Button>
                    <Button onClick={() => handleReject(record.id)} danger>Reddet</Button>
                </div>
            )
        },
    ];

    return (
        <div className="deneme-container">
            <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <h1>Şirket Yönetimi</h1>
                <p className="header-subtitle">Başvuru Yapmış Şirketleri listeleyip, onaylayın veya reddedin!</p>
                <Table columns={columns} dataSource={companies} rowKey="id" className="mt-4" />
            </main>

            {/* Modal for company update */}
            <Modal
                title="Şirket Güncelle"
                visible={isModalVisible}
                onOk={handleUpdateCompany}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="Şirket Adı">
                        <Input
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="E-Posta Domaini">
                        <Input
                            value={updatedEmailDomain}
                            onChange={(e) => setUpdatedEmailDomain(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminCompanyManagement;
