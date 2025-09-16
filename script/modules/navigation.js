import { setCurrentMode } from "./config.js";
import { selectPage } from "./products.js";

let menus = document.querySelectorAll("header nav a");
let main = document.querySelector("main");
let aside = document.querySelector("aside");
let search = document.querySelector(".search");
let buttonBoxes = document.querySelectorAll(".buttonBox");
let hambergerMenu = document.querySelector(".hambergerMenu");

export function hambergerMenuSwitch() {
  hambergerMenu.classList.toggle("activerHambergerMenu");
  aside.classList.toggle("openAside");
}

// Close hamburger menu when modal opens
export function closeHamburgerMenu() {
  if (aside.classList.contains("openAside")) {
    hambergerMenu.classList.remove("activerHambergerMenu");
    aside.classList.remove("openAside");
  }
}
export function menuSelect(menuNumber) {
  for (let x of menus) {
    x.classList.remove("menuItemActive");
  }
  menus[menuNumber].classList.add("menuItemActive");
}

export function homeSelect() {
  menuSelect(0);
  search.style.display = "none";
  main.classList.remove("manActive");
  main.classList.remove("womanActive");
  for (let x of buttonBoxes) x.style.display = "flex";
  document.getElementsByClassName("products")[0].innerHTML = "";
}
export function productsSelect() {
  menuSelect(1);
  main.classList.add("manActive");
  setCurrentMode("");
  document.getElementsByClassName("search")[0].style.display = "inline-block";
  for (let x of buttonBoxes) x.style.display = "none";
  selectPage(1);
}

export function buttonBoxSelect(e) {
  if (e.currentTarget.classList.contains("buttonBoxMan")) {
    main.classList.toggle("manActive");
    setCurrentMode("man");
    //productsData=JSON.parse(manProductsData);
  } else if (e.currentTarget.classList.contains("buttonBoxWoman")) {
    main.classList.toggle("womanActive");
    //productsData=JSON.parse(womanProductsData);
    setCurrentMode("woman");
  }

  if (main.classList.length != 0) {
    // products.innerHTML="";

    setTimeout(() => {
      selectPage(1);
    }, 500);
    search.style.display = "inline-block";
  } else {
    document.getElementsByClassName("products")[0].innerHTML = "";
    search.style.display = "none";
  }
}
