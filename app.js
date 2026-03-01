const API_URL = "https://noona-times-be-5ca9402f90d9.herokuapp.com/";
let currentCategory = "general";
let currentKeyword = "";
let currentPage = 1;

const getNews = async (category, keyword = "", page = 1) => {
  try {
    let url = `${API_URL}top-headlines?country=us&category=${category}&page=${page}`;
    if (keyword) url += `&q=${keyword}`;
    const response = await fetch(url);
    const data = await response.json();
    renderNews(data.articles);
    renderPagination(page);
  } catch (error) {
    console.log("에러:", error);
  }
};

const renderNews = (articles) => {
  const container = document.getElementById("newsContainer");
  if (!articles || articles.length === 0) {
    container.innerHTML = "<p class='no-result'>검색 결과가 없습니다 😥</p>";
    document.getElementById("pagination").innerHTML = "";
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

const renderPagination = (page) => {
  const pagination = document.getElementById("pagination");
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }
  pagination.innerHTML = html;
};

const changePage = (page) => {
  currentPage = page;
  getNews(currentCategory, currentKeyword, currentPage);
  window.scrollTo(0, 0);
};

document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    currentKeyword = "";
    currentPage = 1;
    document.getElementById("searchInput").value = "";
    getNews(currentCategory);
  });
});

document.getElementById("searchBtn").addEventListener("click", () => {
  currentKeyword = document.getElementById("searchInput").value;
  currentPage = 1;
  getNews(currentCategory, currentKeyword);
});

document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    currentKeyword = e.target.value;
    currentPage = 1;
    getNews(currentCategory, currentKeyword);
  }
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav').classList.toggle('open');
});

getNews(currentCategory);