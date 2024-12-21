'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react'
import "./news-widget.scss"

type Article = {
  title: string;
  url: string;
  author: string | null;
  urlToImage: string | null;
  source: {
    name: string;
  };
  publishedAt: string;
};

const NewsWidget = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleNews, setVisibleNews] = useState(5);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=crypto&apiKey=958322bc8b4f4c30abb54607f8ac57b4`
        );
        const data = await response.json();
        setNews(data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const loadMore = () => {
    setVisibleNews(prevVisible => prevVisible + 5);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="news-widget"><h3>Loading news...</h3></div>;

  return (
    <div className="news-widget">
      <h3>Latest Crypto News</h3>
      <ul>
        {news.slice(0, visibleNews).map((article, index) => (
          <li key={index} className="news-item">
            <div className="news-image-container">
              {article.urlToImage ? (
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  className="news-image"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="news-image-placeholder" />
              )}
            </div>
            <div className="news-content">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h4>{article.title}</h4>
              </a>
              {article.author && <p className="author">By: {article.author}</p>}
              <div className="news-meta">
                <span className="source">{article.source.name}</span>
                <span className="published-at">{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {visibleNews < news.length && (
        <button className="load-more" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default NewsWidget;

