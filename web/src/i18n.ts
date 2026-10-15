import { translations, type Lang } from "./translations";

const LANG_KEY = "violet_lang";

let currentLang: Lang = (localStorage.getItem(LANG_KEY) as Lang) ?? "fa";

export function getLang(): Lang {
  return currentLang;
}

export function t(key: string): string {
  return translations[currentLang][key] ?? key;
}

export function applyTranslations(): void {
  document.body.classList.toggle("lang-en", currentLang === "en");
  document.body.style.direction = currentLang === "fa" ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;

  const navLabels = ["home", "products", "aboutUs", "contactUs", "adminLogin"];
  document.querySelectorAll<HTMLElement>("header nav a").forEach((el, i) => {
    if (navLabels[i]) el.textContent = t(navLabels[i]);
  });
  document.querySelectorAll<HTMLElement>("aside nav a").forEach((el, i) => {
    if (navLabels[i]) el.textContent = t(navLabels[i]);
  });

  const searchInput = document.querySelector<HTMLInputElement>("#searchTextFeild");
  if (searchInput) searchInput.placeholder = t("search");

  const manBoxes = document.querySelectorAll<HTMLElement>(".buttonBoxMan strong");
  if (manBoxes[0]) manBoxes[0].textContent = t("products");
  if (manBoxes[1]) manBoxes[1].textContent = t("menProducts");
  const womanBoxes = document.querySelectorAll<HTMLElement>(".buttonBoxWoman strong");
  if (womanBoxes[0]) womanBoxes[0].textContent = t("products");
  if (womanBoxes[1]) womanBoxes[1].textContent = t("womenProducts");

  const titles = document.querySelectorAll<HTMLElement>(".productDetail .title");
  const titleKeys = ["model", "features", "strapType", "clasp"];
  titles.forEach((el, i) => {
    if (titleKeys[i]) el.textContent = t(titleKeys[i]) + ":";
  });

  const userField = document.querySelector<HTMLInputElement>("#userName");
  if (userField) userField.placeholder = t("username");
  const passField = document.querySelector<HTMLInputElement>("#password");
  if (passField) passField.placeholder = t("password");
  const login = document.querySelector<HTMLElement>(".loginForm button");
  if (login) login.textContent = t("login");
  const loginError = document.querySelector<HTMLElement>(".loginErrorMessage");
  if (loginError) loginError.textContent = t("loginError");

  const aboutText = document.querySelector<HTMLElement>("#rightAboutUs p");
  if (aboutText) aboutText.textContent = t("aboutText");

  const contactSections = document.querySelectorAll<HTMLElement>(".contactSection");
  const addressBack = contactSections[0]?.querySelector<HTMLElement>(".back");
  if (addressBack) {
    const h3 = addressBack.querySelector<HTMLElement>("h3");
    const span = addressBack.querySelector<HTMLElement>("span");
    if (h3) h3.textContent = t("address");
    if (span) span.textContent = t("addressText");
  }
  const phoneBack = contactSections[1]?.querySelector<HTMLElement>(".back h3");
  if (phoneBack) phoneBack.textContent = t("phone");
  const socialH3s = contactSections[2]?.querySelectorAll<HTMLElement>(".back h3");
  if (socialH3s && socialH3s.length >= 3) {
    socialH3s[0].textContent = t("email");
    socialH3s[1].textContent = t("eitaa");
    socialH3s[2].textContent = t("rubika");
  }

  const langSpan = document.querySelector<HTMLElement>(".lang-toggle span");
  if (langSpan) langSpan.textContent = currentLang === "fa" ? "EN" : "FA";
}

export function toggleLang(): void {
  currentLang = currentLang === "fa" ? "en" : "fa";
  localStorage.setItem(LANG_KEY, currentLang);
  applyTranslations();
}
