/* ==========================================
   CONFIGURAÇÃO INICIAL
   Mantemos seletores em constantes para evitar
   procurar os mesmos elementos várias vezes.
========================================== */
const root = document.documentElement;
const navMenu = document.querySelector("#nav-menu");
const menuToggle = document.querySelector("#menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const backToTopButton = document.querySelector("#back-to-top");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");
const typingTitle = document.querySelector("#typing-title");

/* ==========================================
   TEMA ESCURO / CLARO
   O Local Storage salva a escolha da pessoa.
   Assim, ao voltar ao site, o tema continua igual.
========================================== */
function applySavedTheme() {
  const savedTheme = localStorage.getItem("album-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

  root.classList.toggle("dark", shouldUseDark);
  updateThemeButtonLabel();
}

function updateThemeButtonLabel() {
  const isDark = root.classList.contains("dark");
  const label = isDark ? "Alternar para modo claro" : "Alternar para modo escuro";

  themeToggle.setAttribute("aria-label", label);
}

function toggleTheme() {
  const isDark = root.classList.toggle("dark");
  localStorage.setItem("album-theme", isDark ? "dark" : "light");
  updateThemeButtonLabel();
}

/* ==========================================
   MENU RESPONSIVO
   Alternamos classes para abrir/fechar o menu.
   Também atualizamos ARIA para acessibilidade.
========================================== */
function setMenuState(isOpen) {
  navMenu.classList.toggle("is-open", isOpen);
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

function toggleMobileMenu() {
  const isOpen = navMenu.classList.contains("is-open");
  setMenuState(!isOpen);
}

function closeMenuAfterNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });
}

/* ==========================================
   EFEITO DE DIGITAÇÃO
   Escrevemos o texto do data-text aos poucos.
   Isso cria impacto no hero sem depender de biblioteca.
========================================== */
function startTypingEffect() {
  if (!typingTitle) return;

  const fullText = typingTitle.dataset.text || "";
  let index = 0;

  function typeNextCharacter() {
    typingTitle.textContent = fullText.slice(0, index);
    index += 1;

    if (index <= fullText.length) {
      window.setTimeout(typeNextCharacter, 58);
    }
  }

  typeNextCharacter();
}

/* ==========================================
   REVELAR AO ROLAR
   Intersection Observer observa quando um item
   entra na tela e adiciona a classe de animação.
========================================== */
function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

/* ==========================================
   LINK ATIVO NO MENU
   Observamos as seções para destacar no menu
   onde a pessoa está na página.
========================================== */
function setupActiveSectionHighlight() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);

          navLinks.forEach((link) => link.classList.remove("is-active"));

          if (activeLink) {
            activeLink.classList.add("is-active");
          }
        }
      });
    },
    {
      threshold: 0.42,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ==========================================
   BOTÃO VOLTAR AO TOPO
   Aparece depois de rolar um pouco a página.
   O scroll suave é feito pelo método scrollTo.
========================================== */
function setupBackToTopButton() {
  function toggleBackToTopVisibility() {
    const shouldShow = window.scrollY > 520;
    backToTopButton.classList.toggle("is-visible", shouldShow);
  }

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", toggleBackToTopVisibility, { passive: true });
  toggleBackToTopVisibility();
}

/* ==========================================
   FECHAR MENU COM ESC
   Boa prática para menus e painéis abertos:
   permitir fechar usando a tecla Escape.
========================================== */
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
}

/* ==========================================
   EVENTOS PRINCIPAIS
   Mantemos os listeners concentrados para que
   seja fácil entender onde as interações nascem.
========================================== */
function setupEventListeners() {
  themeToggle.addEventListener("click", toggleTheme);
  menuToggle.addEventListener("click", toggleMobileMenu);
  closeMenuAfterNavigation();
  setupKeyboardShortcuts();
}

/* ==========================================
   INICIALIZAÇÃO
   Esta função liga todos os recursos do site.
   Chamamos no final porque o script está após o HTML.
========================================== */
function init() {
  applySavedTheme();
  setupEventListeners();
  setupRevealAnimations();
  setupActiveSectionHighlight();
  setupBackToTopButton();
  startTypingEffect();
}

init();
