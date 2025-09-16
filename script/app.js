import { ajax } from "./modules/ajax.js";
import {
  setCurrentLang,
  currentLang,
  translations,
  updateAboutText,
} from "./modules/config.js";
import {
  hambergerMenuSwitch,
  homeSelect,
  productsSelect,
  buttonBoxSelect,
  closeHamburgerMenu,
} from "./modules/navigation.js";
import { selectPage } from "./modules/products.js";
import { showModal, closeModal } from "./modules/modal.js";

let menus = document.querySelectorAll("header nav a");
let asideMenus = document.querySelectorAll("aside nav a");
let products = document.querySelector(".products");

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  loadSavedPreferences();
});

function setupEventListeners() {
  // Navigation menus

  menus[0].addEventListener("click", homeSelect);
  menus[1].addEventListener("click", productsSelect);
  menus[2].addEventListener("click", () => showModal("aboutUs"));
  menus[3].addEventListener("click", () => showModal("contactUs"));
  menus[4].addEventListener("click", () => showModal("loginForm"));

  // Aside menus

  asideMenus[0].addEventListener("click", () => {
    hambergerMenuSwitch();
    homeSelect();
  });
  asideMenus[1].addEventListener("click", () => {
    hambergerMenuSwitch();
    productsSelect();
  });
  asideMenus[2].addEventListener("click", () => {
    hambergerMenuSwitch();
    showModal("aboutUs");
  });
  asideMenus[3].addEventListener("click", () => {
    hambergerMenuSwitch();
    showModal("contactUs");
  });
  asideMenus[4].addEventListener("click", () => {
    hambergerMenuSwitch();
    showModal("loginForm");
  });

  // Other buttons
  document.querySelector(".closeButton").addEventListener("click", closeModal);
  document
    .querySelector(".hambergerMenu")
    .addEventListener("click", hambergerMenuSwitch);

  // Category buttons
  let buttonBoxes = document.querySelectorAll(".buttonBox");
  for (let x of buttonBoxes) {
    x.addEventListener("click", buttonBoxSelect);
  }

  // Login button
  document.getElementById("logInBtn").addEventListener("click", login);

  // Search
  let searchIcon = document.querySelector(
    "header #rightHeader #searchSection i"
  );
  searchIcon.addEventListener("click", showSearch);

  // Theme and language toggles
  document
    .querySelector(".theme-toggle")
    ?.addEventListener("click", toggleTheme);
  document
    .querySelector(".lang-toggle")
    ?.addEventListener("click", toggleLanguage);
}

// Logo click handler
let logo = document.querySelector("header #leftHeader .logo");
if (logo) {
  logo.addEventListener("click", () => {
    homeSelect();
    closeHamburgerMenu();
  });
}

// Theme toggle handler
let themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

// Language toggle handler
let langToggle = document.querySelector(".lang-toggle");
if (langToggle) {
  langToggle.addEventListener("click", toggleLanguage);
}

//functions

function login() {
  let username = document.getElementById("userName").value;
  let pass = document.getElementById("password").value;
  ajax("login", username, pass);

  if (productsData == "")
    document.getElementsByClassName("loginErrorMessage")[0].style.display =
      "inline-block";
  else location.replace("pages/admin.html");
}
function showSearch(e) {
  let searchSection = document.querySelector("#searchSection");
  let inp = e.currentTarget.parentNode.querySelector("input");
  if (getComputedStyle(inp).opacity == 0) {
    inp.style.display = "inline-block";
    inp.classList.add("active");
    searchSection.classList.add("search-active");
    setTimeout(() => (inp.style.opacity = "1"), 100);
  } else {
    if (inp.value == "") {
      inp.style.opacity = "0";
      inp.classList.remove("active");
      searchSection.classList.remove("search-active");
      setTimeout(() => (inp.style.display = "none"), 500);
    }

    selectPage(1);
  }
}

// Theme toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  const themeIcon = document.querySelector(".theme-toggle i");

  // Add null check
  if (themeIcon) {
    if (isDarkMode) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  // Save preference
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// Update language toggle function
function toggleLanguage() {
  const newLang = currentLang === "fa" ? "en" : "fa";
  setCurrentLang(newLang);
  updateLanguage();
  localStorage.setItem("language", newLang);
}

// Update all text content based on current language
function updateLanguage() {
  // Update direction
  document.body.style.direction = currentLang === "fa" ? "rtl" : "ltr";
  document.body.classList.toggle("lang-en", currentLang === "en");

  // Update navigation menus
  menus[0].textContent = translations[currentLang].home;
  menus[1].textContent = translations[currentLang].products;
  menus[2].textContent = translations[currentLang].aboutUs;
  menus[3].textContent = translations[currentLang].contactUs;
  menus[4].textContent = translations[currentLang].adminLogin;

  // Update aside menus
  asideMenus[0].textContent = translations[currentLang].home;
  asideMenus[1].textContent = translations[currentLang].products;
  asideMenus[2].textContent = translations[currentLang].aboutUs;
  asideMenus[3].textContent = translations[currentLang].contactUs;
  asideMenus[4].textContent = translations[currentLang].adminLogin;

  // Update button boxes
  document.querySelectorAll(".buttonBoxMan strong")[0].textContent =
    translations[currentLang].products;
  document.querySelectorAll(".buttonBoxMan strong")[1].textContent =
    translations[currentLang].menProducts;
  document.querySelectorAll(".buttonBoxWoman strong")[0].textContent =
    translations[currentLang].products;
  document.querySelectorAll(".buttonBoxWoman strong")[1].textContent =
    translations[currentLang].womenProducts;

  // Update search placeholder
  document.getElementById("searchTextFeild").placeholder =
    translations[currentLang].search;

  // Update login form
  document.getElementById("userName").placeholder =
    translations[currentLang].username;
  document.getElementById("password").placeholder =
    translations[currentLang].password;
  document.getElementById("logInBtn").textContent =
    translations[currentLang].login;
  document.querySelector(".loginErrorMessage").textContent =
    translations[currentLang].loginError;

  // Update contact info
  let contactSections = document.querySelectorAll(".contactSection");
  if (contactSections.length >= 3) {
    // Address
    let addressSection = contactSections[0].querySelector(".back");
    if (addressSection) {
      addressSection.querySelector("h3").textContent =
        translations[currentLang].address;
      addressSection.querySelector("span").textContent =
        translations[currentLang].addressText;
    }

    // Phone
    let phoneSection = contactSections[1].querySelector(".back");
    if (phoneSection) {
      phoneSection.querySelector("h3").textContent =
        translations[currentLang].phone;
    }

    // Social Media
    let socialSection = contactSections[2].querySelector(".back");
    if (socialSection) {
      let h3s = socialSection.querySelectorAll("h3");
      if (h3s.length >= 3) {
        h3s[0].textContent = translations[currentLang].email;
        h3s[1].textContent = translations[currentLang].eitaa;
        h3s[2].textContent = translations[currentLang].rubika;
      }
    }
  }

  // Update language button
  let langToggleSpan = document.querySelector(".lang-toggle span");
  if (langToggleSpan) {
    langToggleSpan.textContent = currentLang === "fa" ? "EN" : "فا";
  }

  // Update about text
  updateAboutText();

  // Refresh products if displayed
  if (products.innerHTML && products.innerHTML.trim() !== "") {
    selectPage(1);
  }
}

function loadSavedPreferences() {
  // Load theme and language from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    setCurrentLang(savedLang);
    updateLanguage();
  }
}
