import {
  productsData,
  currentLang,
  translations,
  updateAboutText,
} from "./config.js";
import { closeHamburgerMenu } from "./navigation.js";

export function showModal(mode, index) {
  // Close hamburger menu when modal opens
  closeHamburgerMenu();

  let modal = document.querySelector(".modal");
  let modalContainer = modal.querySelector(".container");
  let modalPages = document.querySelectorAll(".modal .container>div");
  let modalImg = modal.querySelector("img");
  for (let x of modalPages) x.style.display = "none";

  switch (mode) {
    case "productDetail":
      let productDetail = modal.querySelector(
        ".modal .container .productDetail"
      );
      productDetail.style.display = "block";
      // Update modal content
      let titles = modal.querySelectorAll(".title");
      titles[0].textContent = translations[currentLang].model + " ";
      titles[1].textContent = translations[currentLang].features;
      titles[2].textContent = translations[currentLang].strapType;
      titles[3].textContent = translations[currentLang].clasp;

      let decriptions = modal.querySelectorAll(".description");
      let productName = productsData[index].name;
      if (currentLang === "en" && productName.includes("محصول")) {
        productName = productName.replace(/محصول/g, "Product");
      }
      decriptions[0].innerHTML = productName;

      // Format descriptions
      let seprateDescriptions = String(productsData[index].case_).split("-");
      let s = "";
      for (let x of seprateDescriptions) {
        s += `<li>${x}</li>`;
      }
      decriptions[1].innerHTML = s;
      seprateDescriptions = String(productsData[index].strap).split("-");
      s = "";
      for (let x of seprateDescriptions) {
        s += `<li>${x}</li>`;
      }
      decriptions[2].innerHTML = s;
      seprateDescriptions = String(productsData[index].glasp).split("-");
      s = "";
      for (let x of seprateDescriptions) {
        s += `<li>${x}</li>`;
      }
      decriptions[3].innerHTML = s;
      modalImg.src = productsData[index].picUrl;
      break;

    case "loginForm":
      let loginForm = modal.querySelector(".modal .container .loginForm");
      loginForm.style.display = "block";
      document.getElementsByClassName("loginErrorMessage")[0].style.display =
        "none";

      break;

    case "aboutUs":
      let aboutUs = modal.querySelector(".modal .container .aboutUs");
      aboutUs.style.display = "flex";
      updateAboutText();

      break;

    case "contactUs":
      let contactUs = modal.querySelector(".modal .container .contactUs");
      contactUs.style.display = "flex";

      break;
  }
  modal.style.opacity = 1;
  modal.style.display = "flex";
  setTimeout(() => {
    modalContainer.style.opacity = 1;
  }, 500);
}

export function closeModal() {
  let modal = document.querySelector(".modal");
  let modalContainer = modal.querySelector(".container");
  modal.style.opacity = 0;
  modalContainer.style.opacity = 0;
  setTimeout(() => (modal.style.display = "none"), 500);
}
