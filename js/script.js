// =========================================================
// 1. 상태 객체
// 여러 상태를 하나의 객체에서 관리합니다.
// =========================================================

const state = {
  theme: "light",

  projects: [],

  projectStatus: "loading",

  selectedLanguage: "all",

  form: {
    name: "",
    email: "",
    message: "",
  },
};

// GitHub 사용자 이름
const githubUsername = "book732";


// =========================================================
// 2. DOM 요소 선택
// =========================================================

const header =
  document.querySelector(".header");

const menuButton =
  document.querySelector(".menu-button");

const navList =
  document.querySelector(".nav-list");

const navLinks =
  document.querySelectorAll(".nav-list a");

const themeToggle =
  document.querySelector("#theme-toggle");

const scrollTopButton =
  document.querySelector("#scroll-top-button");


const projectList =
  document.querySelector("#project-list");

const projectMessage =
  document.querySelector("#project-message");

const retryButton =
  document.querySelector("#retry-button");

const languageFilter =
  document.querySelector("#language-filter");


const contactForm =
  document.querySelector(".contact-form");

const nameInput =
  document.querySelector("#name");

const emailInput =
  document.querySelector("#email");

const messageInput =
  document.querySelector("#message");

const nameError =
  document.querySelector("#name-error");

const emailError =
  document.querySelector("#email-error");

const messageError =
  document.querySelector("#message-error");

const formSuccess =
  document.querySelector("#form-success");


// =========================================================
// 3. 햄버거 메뉴
// 클릭 → class 변경 → 화면 변경
// =========================================================

menuButton?.addEventListener(
  "click",
  () => {
    const isActive =
      navList.classList.toggle("active");

    menuButton.setAttribute(
      "aria-expanded",
      String(isActive)
    );
  }
);


// 메뉴 클릭 후 닫기
navLinks.forEach(
  (link) => {
    link.addEventListener(
      "click",
      () => {
        navList.classList.remove("active");

        menuButton?.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    );
  }
);


// =========================================================
// 4. 부드러운 스크롤
// =========================================================

document
  .querySelectorAll('a[href^="#"]')
  .forEach(
    (link) => {
      link.addEventListener(
        "click",
        (event) => {
          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              targetId
            );

          if (target) {
            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
            });
          }
        }
      );
    }
  );


// =========================================================
// 5. 스크롤 이벤트
// 60px 이상 → nav 스타일 변경
// 300px 이상 → 맨 위 버튼 표시
// =========================================================

window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle(
      "scrolled",
      window.scrollY >= 60
    );

    scrollTopButton?.classList.toggle(
      "visible",
      window.scrollY >= 300
    );
  }
);


// 맨 위 이동
scrollTopButton?.addEventListener(
  "click",
  () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
);


// =========================================================
// 6. 다크 모드
// 이벤트 → 상태 변경 → 화면 업데이트
// =========================================================

// 다크 모드 버튼을 가져옵니다.
const themeButton = document.querySelector("#theme-toggle");

// 저장된 테마를 가져옵니다.
const savedTheme = localStorage.getItem("theme");

// 저장된 테마가 dark라면 다크 모드 적용
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeButton.textContent = "☀️";
} else {
  document.documentElement.setAttribute("data-theme", "light");
  themeButton.textContent = "🌙";
}

// 버튼 클릭
themeButton.addEventListener("click", () => {

  // 현재 테마 확인
  const currentTheme =
    document.documentElement.getAttribute("data-theme");

  // 현재 light라면 dark로 변경
  if (currentTheme === "light") {

    document.documentElement.setAttribute(
      "data-theme",
      "dark"
    );

    localStorage.setItem(
      "theme",
      "dark"
    );

    themeButton.textContent = "☀️";

  } else {

    // 현재 dark라면 light로 변경
    document.documentElement.setAttribute(
      "data-theme",
      "light"
    );

    localStorage.setItem(
      "theme",
      "light"
    );

    themeButton.textContent = "🌙";
  }
});


// =========================================================
// 7. Intersection Observer
// threshold 0.2
// =========================================================

const observer =
  new IntersectionObserver(
    (entries) => {
      entries.forEach(
        (entry) => {
          if (
            entry.isIntersecting
          ) {
            entry.target
              .classList
              .add("visible");

            observer.unobserve(
              entry.target
            );
          }
        }
      );
    },
    {
      threshold: 0.2,
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(
    (element) => {
      observer.observe(element);
    }
  );


// =========================================================
// 8. 프로젝트 상태 렌더링
// =========================================================

const renderProjectStatus = () => {
  retryButton?.classList.add(
    "hidden"
  );

  if (
    state.projectStatus === "loading"
  ) {
    projectMessage.textContent =
      "프로젝트를 불러오는 중입니다...";

    return;
  }

  if (
    state.projectStatus === "empty"
  ) {
    projectMessage.textContent =
      "표시할 프로젝트가 없습니다.";

    return;
  }

  if (
    state.projectStatus === "error"
  ) {
    if (
      !projectMessage.textContent
    ) {
      projectMessage.textContent =
        "프로젝트를 불러올 수 없습니다.";
    }

    retryButton?.classList.remove(
      "hidden"
    );

    return;
  }

  projectMessage.textContent = "";
};


// =========================================================
// 9. GitHub 카드 생성
// 구조분해 할당 사용
// =========================================================

const createProjectCard =
  (repo) => {
    const {
      name,
      description,
      stargazers_count: stars,
      language,
      html_url: htmlUrl,
    } = repo;

    return `
      <article class="project-card">
        <h3>${name}</h3>

        <p>
          ${
            description ||
            "프로젝트 설명이 없습니다."
          }
        </p>

        <p>
          ⭐ ${stars}
          ·
          ${language || "기타"}
        </p>

        <a
          href="${htmlUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub에서 보기
        </a>
      </article>
    `;
  };


// =========================================================
// 10. 프로젝트 렌더링
// filter + map 사용
// =========================================================

const renderProjects = () => {
  if (!projectList) {
    return;
  }

  const filteredProjects =
    state.selectedLanguage === "all"
      ? state.projects
      : state.projects.filter(
          ({ language }) =>
            (language || "기타") ===
            state.selectedLanguage
        );

  if (
    filteredProjects.length === 0
  ) {
    projectList.innerHTML = "";

    projectMessage.textContent =
      "표시할 프로젝트가 없습니다.";

    return;
  }

  const cards =
    filteredProjects
      .slice(0, 6)
      .map(
        (repo) =>
          createProjectCard(repo)
      );

  projectList.innerHTML =
    cards.join("");
};


// =========================================================
// 11. 프로젝트 언어 필터
// =========================================================

const renderLanguageFilter =
  () => {
    if (!languageFilter) {
      return;
    }

    const languages = [
      ...new Set(
        state.projects.map(
          ({ language }) =>
            language || "기타"
        )
      ),
    ].sort();

    const options =
      languages
        .map(
          (language) =>
            `
            <option value="${language}">
              ${language}
            </option>
            `
        )
        .join("");

    languageFilter.innerHTML =
      `
      <option value="all">
        전체 언어
      </option>

      ${options}
      `;
  };


// =========================================================
// 12. GitHub API 호출
// async/await + try/catch
// =========================================================

const fetchGitHubProjects =
  async () => {
    if (
      !projectList ||
      !projectMessage
    ) {
      return;
    }

    state.projectStatus =
      "loading";

    projectList.innerHTML = "";

    renderProjectStatus();

    try {
      const response =
        await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated`
        );

      // Rate Limit
      if (
        response.status === 403
      ) {
        throw new Error(
          "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
        );
      }

      if (!response.ok) {
        throw new Error(
          "GitHub 데이터를 불러오지 못했습니다."
        );
      }

      const repos =
        await response.json();

      state.projects = repos;

      if (
        repos.length === 0
      ) {
        state.projectStatus =
          "empty";

        renderProjectStatus();

        return;
      }

      state.projectStatus =
        "success";

      renderProjectStatus();

      renderLanguageFilter();

      renderProjects();

    } catch (error) {
      state.projectStatus =
        "error";

      projectMessage.textContent =
        error instanceof Error
          ? error.message
          : "프로젝트를 불러올 수 없습니다.";

      renderProjectStatus();
    }
  };


// 다시 시도
retryButton?.addEventListener(
  "click",
  () => {
    fetchGitHubProjects();
  }
);


// 언어 필터 변경
languageFilter?.addEventListener(
  "change",
  (event) => {
    state.selectedLanguage =
      event.target.value;

    renderProjects();
  }
);


// =========================================================
// 13. 이메일 검사 함수
// =========================================================

const isValidEmail =
  (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);
  };


// =========================================================
// 14. 이름 검사
// =========================================================

const validateName =
  () => {
    const value =
      state.form.name.trim();

    if (!value) {
      nameError.textContent =
        "이름을 입력해주세요.";

      return false;
    }

    nameError.textContent = "";

    return true;
  };


// =========================================================
// 15. 이메일 검사
// =========================================================

const validateEmail =
  () => {
    const value =
      state.form.email.trim();

    if (!value) {
      emailError.textContent =
        "이메일을 입력해주세요.";

      return false;
    }

    if (
      !isValidEmail(value)
    ) {
      emailError.textContent =
        "올바른 이메일 형식으로 입력해주세요.";

      return false;
    }

    emailError.textContent = "";

    return true;
  };


// =========================================================
// 16. 메시지 검사
// =========================================================

const validateMessage =
  () => {
    const value =
      state.form.message.trim();

    if (!value) {
      messageError.textContent =
        "메시지를 입력해주세요.";

      return false;
    }

    messageError.textContent = "";

    return true;
  };


// =========================================================
// 17. input 이벤트
// 입력 → state 변경 → 검증 → 화면 업데이트
// =========================================================

nameInput?.addEventListener(
  "input",
  (event) => {
    state.form.name =
      event.target.value;

    validateName();
  }
);


emailInput?.addEventListener(
  "input",
  (event) => {
    state.form.email =
      event.target.value;

    validateEmail();
  }
);


messageInput?.addEventListener(
  "input",
  (event) => {
    state.form.message =
      event.target.value;

    validateMessage();
  }
);


// =========================================================
// 18. 폼 submit
// =========================================================

contactForm?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const isNameValid =
      validateName();

    const isEmailValid =
      validateEmail();

    const isMessageValid =
      validateMessage();

    if (
      !isNameValid ||
      !isEmailValid ||
      !isMessageValid
    ) {
      formSuccess.textContent = "";

      return;
    }

    formSuccess.textContent =
      "입력이 정상적으로 확인되었습니다.";

    contactForm.reset();

    state.form = {
      name: "",
      email: "",
      message: "",
    };
  }
);


// =========================================================
// 19. 초기 실행
// =========================================================


fetchGitHubProjects();