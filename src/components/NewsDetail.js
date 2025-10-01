import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import './NewsDetail.css';

function NewsDetail({ apiUrl }) {
    const { slug } = useParams();
    const [newsDetail, setNewsDetail] = useState(null);
    const [authorName, setAuthorName] = useState('');
    const navigate = useNavigate();

    // Asegúrate que apiUrl termina sin slash, ejemplo: http://localhost:3000
    const noticiasApiUrl = `${apiUrl}/noticias/${slug}`;
    const autoresApiUrl = `${apiUrl}/autores`;

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const response = await fetch(noticiasApiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setNewsDetail(data);

                if (data && data.id_autor) {
                    fetchAuthorName(data.id_autor);
                }
            } catch (error) {
                console.error('Error fetching news detail:', error);
            }
        };

        const fetchAuthorName = async (authorId) => {
            try {
                const authorResponse = await fetch(`${autoresApiUrl}/${authorId}`);
                if (!authorResponse.ok) throw new Error(`HTTP error! status: ${authorResponse.status}`);
                const authorData = await authorResponse.json();
                setAuthorName(authorData.nombre_autor || '');
            } catch (error) {
                console.error('Error fetching author name:', error);
                setAuthorName('');
            }
        };

        fetchNewsDetail();
    }, [noticiasApiUrl, autoresApiUrl]);

    const handleGoBack = () => navigate(-1);

    if (!newsDetail) {
        return (
            <div className="news-detail-page">
                <div className="loading-container">
                    <p>Cargando detalles de la noticia...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="news-detail-page">
            <div className="news-detail-header">
                <h1>{newsDetail.titulo}</h1>
                <div className="news-detail-meta">
                    <span>
                        {moment(newsDetail.fecha_publicacion).locale('es').format('LLLL')}
                        {authorName && <span className="news-author"> por {authorName}</span>}
                    </span>
                </div>
            </div>

            <div className="news-detail-image">
                <img
                    src={newsDetail.url_imagen_principal || newsDetail.url || 'https://via.placeholder.com/800x400'}
                    alt={newsDetail.titulo}
                />
            </div>

            <div
                className="news-detail-content"
                dangerouslySetInnerHTML={{ __html: newsDetail.contenido }}
            />

            <div className="news-detail-footer">
                <button onClick={handleGoBack} className="back-button">
                    ← Volver atrás
                </button>
            </div>
        </div>
    );
}

export default NewsDetail;
