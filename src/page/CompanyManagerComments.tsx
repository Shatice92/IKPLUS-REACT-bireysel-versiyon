import React, { useState } from 'react';
import CompanyManagerSidebar from '../components/organisms/CompanyManagerSidebar';
import './CompanyManagerComments.css';
import swal from 'sweetalert';

function CompanyManagerComments() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [submittedComments, setSubmittedComments] = useState<{ comment: string; rating: number }[]>([]);

    const handleStarClick = (selectedRating: number) => {
        setRating(selectedRating);
    };

    const handleSubmit = async () => {
        if (comment.trim() === "") {
            swal("Başarısız", "Lütfen bir yorum yazın", "warning");
            return;
        }
        if (rating === 0) {
            swal("Başarısız", "Lütfen puan verin", "warning");
            return;
        }

        const token = sessionStorage.getItem("token"); // Kullanıcının oturum token'ını al
        if (!token) {
            swal("Başarısız", "Önce giriş yapmalısınız.", "error");
            return;
        }

        const newComment = {
            comment: comment,
            rating: rating
        };

        try {
            const response = await fetch("http://localhost:9090/v1/dev/comment/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // JWT token ekleyerek yetkilendirme yap
                },
                body: JSON.stringify(newComment)
            });

            const data = await response.json();

            if (response.ok) {
                swal("Başarılı", "Yorum başarı ile kaydedildi.", "success");
                setSubmittedComments([...submittedComments, newComment]); // Yorumları ekrana ekle
                setComment(""); // Yorum kutusunu temizle
                setRating(0); // Yıldızları sıfırla
            } else {
                alert(data.message || "Yorum kaydedilirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Hata:", error);
            swal("Başarısız", "Zaten yorum yaptınız!", "error");
        }
    };

    return (
        <div className={`deneme-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <p className="header-subtitle">
                    Şirket Yöneticisi olarak bizimle olan deneyimlerinizi paylaşıp hizmetimizi geliştirmemize katkıda bulunabilirsiniz.
                </p>

                <div className="rating-container">
                    <p>Puanınızı seçin:</p>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? "selected" : ""}`}
                                onClick={() => handleStarClick(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <textarea
                    className="comment-box"
                    placeholder="Yorumunuzu buraya yazın..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <button className="btn btn-primary" onClick={handleSubmit}>
                    Gönder
                </button>

                <div className="comments-list">
                    <h3>Yorumlar</h3>
                    {submittedComments.length > 0 ? (
                        submittedComments.map((item, index) => (
                            <div key={index} className="comment-item">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={`star ${star <= item.rating ? "selected" : ""}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p>{item.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>Henüz yorum yapılmadı.</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default CompanyManagerComments;
