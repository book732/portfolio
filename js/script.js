// 메뉴 버튼과 메뉴 목록 선택
const menuButton = document.querySelector(".menu-button");
const navList = document.querySelector(".nav-list");

if (menuButton && navList) {
  menuButton.addEventListener("click", function () {
    navList.classList.toggle("active");
  });
}

// 연락처 폼 제출 이벤트
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("메시지가 전송되었습니다!");
  });
}

// GitHub 사용자 이름
const githubUsername = "book732";

// 프로젝트 목록 영역 선택
const projectList = document.querySelector("#project-list");
const projectMessage = document.querySelector("#project-message");

console.log("script.js 연결됨");
console.log("projectList:", projectList);
console.log("projectMessage:", projectMessage);

// GitHub 저장소 목록 가져오기
async function fetchGitHubProjects() {
  // HTML 요소가 없을 때 확인용
  if (!projectList || !projectMessage) {
    console.error("프로젝트 영역을 찾지 못했습니다. HTML의 id를 확인하세요.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated`
    );

    console.log("GitHub 응답:", response);

    if (!response.ok) {
      throw new Error("GitHub 데이터를 불러오지 못했습니다.");
    }

    const repos = await response.json();

    console.log("불러온 저장소:", repos);

    projectMessage.textContent = "";
    projectList.innerHTML = "";

    if (repos.length === 0) {
      projectMessage.textContent = "표시할 프로젝트가 없습니다.";
      return;
    }

    repos.slice(0, 6).forEach(function (repo) {
      const projectCard = document.createElement("article");
      projectCard.classList.add("project-card");

      projectCard.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "프로젝트 설명이 없습니다."}</p>
        <p class="project-meta">
          ⭐ ${repo.stargazers_count} | ${repo.language || "기타"}
        </p>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
          GitHub에서 보기
        </a>
      `;

      projectList.appendChild(projectCard);
    });
  } catch (error) {
    projectMessage.textContent = "프로젝트를 불러오는 중 문제가 발생했습니다.";
    console.error("GitHub API 오류:", error);
  }
}

fetchGitHubProjects();