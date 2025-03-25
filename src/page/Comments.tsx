import React, { useEffect, useState, useCallback } from "react";
import { IComment } from "../model/IComment";
import "./Comments.css";

const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Veri alınırken hata oluştu. Hata kodu: ${response.status}`);
  }
  return response.json();
};

const Comments: React.FC = () => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await fetchData("http://localhost:9090/v1/dev/comment/list");
      setComments(responseData.data || []);
    } catch (err: any) {
      setError(err.message || "Yorumları yüklerken hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="deneme-container">
    <div className="comments-container">
      <div className="comments-wrapper">
        <h2 className="title">Kullanıcı Yorumları</h2>

        {loading ? (
          <div className="loading-container">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="comment-card skeleton">
                <div className="user-image skeleton-box"></div>
                <div className="comment-content">
                  <p className="comment-text skeleton-box"></p>
                  <p className="rating skeleton-box"></p>
                  <p className="date skeleton-box"></p>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">❌ {error}</div>
        ) : comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <img
                  src={comment.userImageUrl || "https://via.placeholder.com/50"}
                  alt="User"
                  className="user-image"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/50")}
                />
                <div className="comment-content">
                  <p className="comment-text">{comment.comment}</p>
                  <p className="rating">⭐ {comment.rating || "Belirtilmemiş"}</p>
                  <p className="date">📅 {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Tarih Yok"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments">Henüz yorum bulunmuyor.</div>
        )}

        <button onClick={fetchComments} className="refresh-button" disabled={loading}>
          {loading ? "Yükleniyor..." : <>🔄 Yorumları Yenile</>}
        </button>
      </div>
    </div>
    </div>
  );
};

export default Comments;