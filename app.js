const API_URL = "https://noona-times-be-5ca9402f90d9.herokuapp.com/";
let currentCategory = "general";

// 뉴스 불러오기
const getNews = async (category, keyword = "") => {
  try {
    let url = `${API_URL}top-headlines?country=us&category=${category}`;
    if (keyword) url += `&q=${keyword}`;
    
    const response = await fetch(url);
    const data = await response.json();
    renderNews(data.articles);
  } catch (error) {
    console.log("에러:", error);
  }
};

// 뉴스 화면에 그리기
const renderNews = (articles) => {
  const container = document.getElementById("newsContainer");
  
  if (!articles || articles.length === 0) {
    container.innerHTML = "<p class='no-result'>검색 결과가 없습니다 😥</p>";
    return;
  }

  container.innerHTML = articles.map(article => `
    <div class="news-card">
      <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" 
           onerror="this.src='https://via.placeholder.com/300x200'">
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">자세히 보기 →</a>
      </div>
    </div>
  `).join("");
};

// 카테고리 버튼
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    document.getElementById("searchInput").value = "";
    getNews(currentCategory);
  });
});

// 검색
document.getElementById("searchBtn").addEventListener("click", () => {
  const keyword = document.getElementById("searchInput").value;
  getNews(currentCategory, keyword);
});

// 엔터키 검색
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const keyword = e.target.value;
    getNews(currentCategory, keyword);
  }
});

// 시작시 뉴스 불러오기
getNews(currentCategory);