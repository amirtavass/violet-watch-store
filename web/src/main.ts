import { api, setToken } from "./api";
import { applyTranslations, toggleLang } from "./i18n";
import { initModal, showModal } from "./modal";
import { initTheme, toggleTheme } from "./theme";
import { loadProducts, setGender } from "./products";

function initNavigation(): void {
  const menus = document.querySelectorAll<HTMLElement>("header nav a");
  const asideMenus = document.querySelectorAll<HTMLElement>("aside nav a");
  const main = document.querySelector<HTMLElement>("main");
  const search = document.querySelector<HTMLElement>(".search");
  const buttonBoxes = document.querySelectorAll<HTMLElement>(".buttonBox");
  const productsEl = document.querySelector<HTMLElement>(".products");

  const menuSelect = (index: number): void => {
    menus.forEach((el) => el.classList.remove("menuItemActive"));
    menus[index]?.classList.add("menuItemActive");
  };

  const homeSelect = (): void => {
    menuSelect(0);
    if (search) search.style.display = "none";
    main?.classList.remove("manActive", "womanActive");
    buttonBoxes.forEach((el) => (el.style.display = "flex"));
    if (productsEl) productsEl.innerHTML = "";
    setGender("");
  };

  const productsSelect = (): void => {
    menuSelect(1);
    main?.classList.add("manActive");
    setGender("");
    if (search) search.style.display = "inline-block";
    buttonBoxes.forEach((el) => (el.style.display = "none"));
    void loadProducts(1);
  };

  const handlers: Array<() => void> = [
    homeSelect,
    productsSelect,
    () => {
      menuSelect(2);
      showModal("aboutUs");
    },
    () => {
      menuSelect(3);
      showModal("contactUs");
    },
    () => {
      menuSelect(4);
      showModal("loginForm");
    },
  ];

  menus.forEach((el, i) => el.addEventListener("click", handlers[i]));
  asideMenus.forEach((el, i) =>
    el.addEventListener("click", () => {
      handlers[i]?.();
      const aside = document.querySelector<HTMLElement>("aside");
      const ham = document.querySelector<HTMLElement>(".hambergerMenu");
      ham?.classList.remove("activerHambergerMenu");
      aside?.classList.remove("openAside");
    })
  );

  document.querySelectorAll<HTMLElement>(".buttonBox").forEach((box) => {
    box.addEventListener("click", () => {
      if (box.classList.contains("buttonBoxMan")) {
        main?.classList.toggle("manActive");
        setGender("man");
      } else {
        main?.classList.toggle("womanActive");
        setGender("woman");
      }

      const active = main?.classList.contains("manActive") || main?.classList.contains("womanActive");
      if (active) {
        setTimeout(() => void loadProducts(1), 500);
        if (search) search.style.display = "inline-block";
      } else {
        if (productsEl) productsEl.innerHTML = "";
        if (search) search.style.display = "none";
      }
    });
  });
}

function initSearch(): void {
  const searchIcon = document.querySelector<HTMLElement>("header #rightHeader #searchSection i");
  const searchInput = document.querySelector<HTMLInputElement>("#searchTextFeild");

  searchIcon?.addEventListener("click", () => {
    const section = document.querySelector<HTMLElement>("#searchSection");
    if (!searchInput || !section) return;

    const isHidden = getComputedStyle(searchInput).opacity === "0";
    if (isHidden) {
      searchInput.style.display = "inline-block";
      searchInput.classList.add("active");
      section.classList.add("search-active");
      setTimeout(() => (searchInput.style.opacity = "1"), 100);
    } else {
      if (searchInput.value === "") {
        searchInput.style.opacity = "0";
        searchInput.classList.remove("active");
        section.classList.remove("search-active");
        setTimeout(() => (searchInput.style.display = "none"), 500);
      }
      void loadProducts(1);
    }
  });

  let debounce: number | undefined;
  searchInput?.addEventListener("input", () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => void loadProducts(1), 350);
  });
}

function initLogin(): void {
  const loginBtn = document.querySelector<HTMLButtonElement>("#logInBtn");
  const errorEl = document.querySelector<HTMLElement>(".loginErrorMessage");

  loginBtn?.addEventListener("click", async () => {
    const username = document.querySelector<HTMLInputElement>("#userName")?.value ?? "";
    const password = document.querySelector<HTMLInputElement>("#password")?.value ?? "";

    try {
      const result = await api.login(username, password);
      setToken(result.token);
      location.replace("/admin.html");
    } catch {
      if (errorEl) errorEl.style.display = "inline-block";
    }
  });
}

function initChrome(): void {
  const ham = document.querySelector<HTMLElement>(".hambergerMenu");
  ham?.addEventListener("click", () => {
    ham.classList.toggle("activerHambergerMenu");
    document.querySelector("aside")?.classList.toggle("openAside");
  });

  document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);
  document.querySelector(".lang-toggle")?.addEventListener("click", () => {
    toggleLang();
    const productsEl = document.querySelector<HTMLElement>(".products");
    if (productsEl && productsEl.innerHTML.trim() !== "") void loadProducts(1);
  });
}

initTheme();
initModal();
initNavigation();
initSearch();
initLogin();
initChrome();
applyTranslations();
