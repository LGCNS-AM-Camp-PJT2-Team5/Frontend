import React from "react";
import { useLocation } from "react-router-dom";
import "./CompanyDetail.css";
import Title from "../../components/common/Title";
import "./CompanyNews.css";

export default function CompanyNews() {
  const location = useLocation();
  const { company, news } = location.state || {}; // 데이터가 없을 경우 undefined 방지

  if (!company || news.length === 0) {
    return <p className="loading">데이터가 없습니다. 이전 페이지에서 접근하세요.</p>;
  }

  return (
    <div className="company-news-container">
      <Title mainTitle2={`${company.name} 기사`} />
      <div className="news-list">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="news-item"
            style={{ textDecoration: "none", color: "inherit" }} // 기본 링크 스타일 제거
          >
            <h3>{item.title}</h3>
            <p className="news-date">{new Date(item.publishedDate).toLocaleDateString()}</p>
            <div style={{color:"#888"}}>자세히 보기 →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
