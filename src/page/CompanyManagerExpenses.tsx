import React, { useState, useEffect } from 'react';
import CompanyManagerSidebar from '../components/organisms/CompanyManagerSidebar';

function CompanyManagerExpenses() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [expenses, setExpenses] = useState<any[]>([]); // Harcamaları tutacak state
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Hata mesajları için state

    // Türkçe durumu için nesne
    const expenseStatusTranslations: { [key: string]: string } = {
        DRAFT: 'Taslak',
        PENDING_APPROVAL: 'Beklemede',
        APPROVED: 'Onaylandı',
        REJECTED: 'Reddedildi',
        CANCELLED: 'İptal Edildi',
        DELETED: 'Silindi',
        PAID: 'Ödendi',
        SUBMITTED: 'Gönderildi',
        WAITING: 'Bekliyor',
    };

    // Harcamaları API'den al
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setErrorMessage("Token bulunamadı, giriş yapmanız gerekiyor.");
            return;
        }

        fetch("http://localhost:9090/v1/dev/company-manager/expenses/get-by-companyId", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setExpenses(data.data); // Harcamaları state'e set et
                } else {
                    setErrorMessage("Harcamalar alınırken hata oluştu.");
                }
            })
            .catch((err) => {
                setErrorMessage("Harcamalar alınırken bir hata oluştu.");
            });
    }, []); // Component mount olduğunda çalışacak

    // Harcama durumunu frontend tarafında güncelleme fonksiyonu
    const updateExpenseStatus = (expenseId: number, status: string) => {
        // Harcamalar listesini kopyala
        const updatedExpenses = expenses.map((expense) =>
            expense.id === expenseId ? { ...expense, status } : expense
        );

        // Güncellenmiş harcamaları state'e set et
        setExpenses(updatedExpenses);
    };

    return (
        <div className={`deneme-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <div className="permissions-container">
                    <p className="header-subtitle">
                        Şirket Yöneticisi olarak çalışanlarınızın harcamalarını yönetebilirsiniz.
                    </p>

                    {/* Hata mesajı varsa göster */}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    {/* Harcamalar Tablosu */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Çalışan ID</th>
                                <th>Tutar</th>
                                <th>Makbuz</th>
                                <th>Durum</th>
                                <th>İşlemler</th> {/* Yeni sütun */}
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{expense.employeeId}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.receipt ? 'Var' : 'Yok'}</td>
                                        <td>{expenseStatusTranslations[expense.status] || "Bilinmeyen Durum"}</td>
                                        <td>
                                            {/* İşlemler sütunu */}
                                            <button 
                                                className="btn btn-success" 
                                                onClick={() => updateExpenseStatus(expense.id, "APPROVED")}
                                            >
                                                Onayla
                                            </button>
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => updateExpenseStatus(expense.id, "REJECTED")}
                                            >
                                                Reddet
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>Harcamalar bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default CompanyManagerExpenses;
