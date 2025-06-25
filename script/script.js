let aside = document.querySelector("aside");
let menus = document.querySelectorAll("header nav a");
let asideMenus = document.querySelectorAll("aside nav a");
let main = document.querySelector("main");
let search = document.querySelector(".search");
let searchedValue;
let products = document.querySelector(".products");
let modal = document.querySelector(".modal");
let modalImg = modal.querySelector("img");
let modalContainer = modal.querySelector(".container");
let closeButtonContainer = modalContainer.querySelector(".closeButton");
// either man or woman section is selected
let curentMode = "";
//array of products
let productsData = "";
// Language state
let currentLang = "fa"; // Default Persian

// Translations object
const translations = {
  fa: {
    home: "خانه",
    products: "محصولات",
    aboutUs: "درباره ما",
    contactUs: "تماس با ما",
    adminLogin: "ورود مدیریت",
    menProducts: "مردانه",
    womenProducts: "زنانه",
    search: "جستجو...",
    model: "مدل:",
    features: "ویژگی های ظاهری:",
    strapType: "نوع بند:",
    clasp: "سگک:",
    username: "Username",
    password: "Password",
    login: "Log in",
    loginError: "نام کاربری یا کلمه عبور صحیح نمی باشد",
    notFound: "محصولی یافت نشد",
    aboutText:
      "فروشگاه وایولت ارائه دهنده انواع ساعت در شهر تهران است. ما با تمرکز بر سه ویژگی، یعنی: قابل اعتماد بودن، خدمات مشتری و منحصر به فرد بودن در کنار شما خواهیم بود. فروشگاه وایولت در [سال] توسط [نام مؤسس] تأسیس شد، فروشگاه وایولت فعالیت خود را در شیراز آغاز کرده. هنگامی که [موسس فروشگاه] برای اولین بار شروع به فعالیت کرد، اشتیاق او به  فراهم کردن بهترین تجهیزات سوق داد. کار‌های روزانه به او انگیزه داد تا کار سخت و الهام بخش را به یک فروشگاه آنلاین پررونق تبدیل کند. ما اکنون در سرتاسر ایران به مشتریانمان خدمات ارائه می دهیم امیدواریم از محصولات ما به همان اندازه که ما از ارائه آن‌ها به شما لذت می‌‌بریم لذت ببرید. اگر سوال یا نظری دارید، لطفا با ما تماس بگیرید",
    address: "آدرس",
    addressText: "تهران-پونک جنوبی",
    phone: "شماره تلفن",
    email: "رایانامه",
    eitaa: "ایتا",
    rubika: "روبیکا",
    product: "محصول",
  },
  en: {
    home: "Home",
    products: "Collections",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    adminLogin: "Admin Login",
    menProducts: "Men",
    womenProducts: "Women",
    search: "Search...",
    model: "Model:",
    features: "Features:",
    strapType: "Strap Type:",
    clasp: "Clasp:",
    username: "Username",
    password: "Password",
    login: "Log in",
    loginError: "Invalid username or password",
    notFound: "No products found",
    aboutText:
      "Violet Store is a provider of various watches in Tehran. We focus on three features: reliability, customer service, and uniqueness. Violet Store was founded in [year] by [founder name] and started its activity in Shiraz. When the founder first started, their passion drove them to provide the best equipment. Daily work motivated them to turn hard work and inspiration into a thriving online store. We now serve our customers throughout Iran and hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please contact us.",
    address: "Address",
    addressText: "Tehran - South Punak",
    phone: "Phone Number",
    email: "Email",
    eitaa: "Eitaa",
    rubika: "Rubika",
    product: "Product",
  },
};

let loginBtn = document.getElementById("logInBtn");
loginBtn.addEventListener("click", login);

let searchIcon = document.querySelector("header #rightHeader #searchSection i");
searchIcon.addEventListener("click", showSearch);

let buttonBoxes = document.querySelectorAll(".buttonBox");
for (let x of buttonBoxes) x.addEventListener("click", buttonBoxSelect);

let homeMenu = menus[0];
homeMenu.addEventListener("click", homeSelect);

let productsMenu = menus[1];
productsMenu.addEventListener("click", productsSelect);

let aboutUsMenu = menus[2];
aboutUsMenu.addEventListener("click", () => showModal("aboutUs"));

let contactUs = menus[3];
contactUs.addEventListener("click", () => showModal("contactUs"));

let loginMenu = menus[4];
loginMenu.addEventListener("click", () => showModal("loginForm"));

let asideHomeMenu = asideMenus[0];
asideHomeMenu.addEventListener("click", () => {
  hambergerMenuSwitch();
  homeSelect();
});

let asideProductsMenu = asideMenus[1];
asideProductsMenu.addEventListener("click", () => {
  hambergerMenuSwitch();
  productsSelect();
});

let asideAboutUsMenu = asideMenus[2];
asideAboutUsMenu.addEventListener("click", () => {
  hambergerMenuSwitch();
  showModal("aboutUs");
});

let asideContactUs = asideMenus[3];
asideContactUs.addEventListener("click", () => {
  hambergerMenuSwitch();
  showModal("contactUs");
});

let asideLoginMenu = asideMenus[4];
asideLoginMenu.addEventListener("click", () => {
  hambergerMenuSwitch();
  showModal("loginForm");
});

closeButtonContainer.addEventListener("click", closeModal);

let hambergerMenu = document.querySelector(".hambergerMenu");
hambergerMenu.addEventListener("click", hambergerMenuSwitch);

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
function hambergerMenuSwitch() {
  hambergerMenu.classList.toggle("activerHambergerMenu");
  aside.classList.toggle("openAside");
}

// Close hamburger menu when modal opens
function closeHamburgerMenu() {
  if (aside.classList.contains("openAside")) {
    hambergerMenu.classList.remove("activerHambergerMenu");
    aside.classList.remove("openAside");
  }
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
function login() {
  let username = document.getElementById("userName").value;
  let pass = document.getElementById("password").value;
  ajax("login", username, pass);
  console.log(productsData);

  if (productsData == "")
    document.getElementsByClassName("loginErrorMessage")[0].style.display =
      "inline-block";
  else location.replace("pages/admin.html");
}
function menuSelect(menuNumber) {
  for (let x of menus) {
    x.classList.remove("menuItemActive");
  }
  menus[menuNumber].classList.add("menuItemActive");
}

function homeSelect() {
  menuSelect(0);
  search.style.display = "none";
  main.classList.remove("manActive");
  main.classList.remove("womanActive");
  for (x of buttonBoxes) x.style.display = "flex";
  document.getElementsByClassName("products")[0].innerHTML = "";
}
function productsSelect() {
  menuSelect(1);
  main.classList.add("manActive");
  curentMode = "";
  document.getElementsByClassName("search")[0].style.display = "inline-block";
  for (x of buttonBoxes) x.style.display = "none";
  selectPage(1);
}

function buttonBoxSelect(e) {
  if (e.currentTarget.classList.contains("buttonBoxMan")) {
    main.classList.toggle("manActive");
    curentMode = "man";
    //productsData=JSON.parse(manProductsData);
  } else if (e.currentTarget.classList.contains("buttonBoxWoman")) {
    main.classList.toggle("womanActive");
    //productsData=JSON.parse(womanProductsData);
    curentMode = "woman";
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
//ajax

function ajax(
  mode,
  id,
  name,
  case_ = "",
  glasp = "",
  strap = "",
  picUrl = "",
  gender = "",
  page = ""
) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (this.responseText == "0") productsData = "";
    else {
      productsData = JSON.parse(this.responseText);
      //   document.write(this.responseText);
    }
  };
  //xhttp.open("GET", `pages/page2.php?mode=${mode}&id=${id}&name=${name}&case_=${case_}&strap=${strap}&glasp=${glasp}&picUrl=${picUrl}&gender=${gender}&page=${page}`, false);
  //xhttp.send();
  //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.open("POST", "pages/page2.php", false);
  let fd = new FormData();
  fd.append("mode", mode);
  fd.append("id", id);
  fd.append("name", name);
  fd.append("case_", case_);
  fd.append("strap", strap);
  fd.append("glasp", glasp);
  fd.append("picUrl", picUrl);
  fd.append("gender", gender);
  fd.append("page", page);

  xhttp.send(fd);
}

//selectpage and modal
function selectPage(page) {
  searchedValue = document.getElementById("searchTextFeild").value;
  ajax("select", "", searchedValue, "", "", "", "", curentMode, page);
  console.log(searchedValue);
  if (productsData == "") {
    products.innerHTML = `<nav>${translations[currentLang].notFound}</nav>`;
    return;
  }
  products.innerHTML = "<nav></nav>";

  for (let x = productsData.length - 2; x >= 0; x--) {
    // Translate product names if in English
    let productName = productsData[x].name;
    if (currentLang === "en" && productName.includes("محصول")) {
      productName = productName.replace(/محصول/g, "Product");
    }

    products.innerHTML =
      `<div class="product" onclick="showModal('productDetail',${x})">
                                    <img src="${productsData[x].picUrl}" alt="">
                                    <div class="cover"></div>
                                    <div class="textSection">
                                    <span>${translations[currentLang].model}</span>
                                    <span>${productName}</span>
                                    </div>
                                 </div>` + products.innerHTML;
  }
  let nav = document.querySelector(".products nav");
  let pageCount = productsData[productsData.length - 1].pages;
  if (pageCount > 1) {
    for (let i = 0; i < pageCount; i++) {
      nav.innerHTML += `<span onClick="selectPage(${i + 1})">${i + 1}</span>`;
    }
    document
      .querySelector(`.products nav span:nth-of-type(${page})`)
      .classList.add("navItemActive");
  }
}

function showModal(mode, index) {
  // Close hamburger menu when modal opens
  closeHamburgerMenu();

  let modalPages = document.querySelectorAll(".modal .container>div");
  for (let x of modalPages) x.style.display = "none";

  switch (mode) {
    case "productDetail":
      let productDetail = modal.querySelector(
        ".modal .container .productDetail"
      );
      productDetail.style.display = "block";
      // Update modal text based on language
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

function closeModal() {
  modal.style.opacity = 0;
  modalContainer.style.opacity = 0;
  setTimeout(() => (modal.style.display = "none"), 500);
}

// Theme toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  const themeIcon = document.querySelector(".theme-toggle i");

  if (isDarkMode) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }

  // Save preference
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// Update language toggle function
function toggleLanguage() {
  currentLang = currentLang === "fa" ? "en" : "fa";
  updateLanguage();
  localStorage.setItem("language", currentLang);
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
ideMenus[2].textContent = translations[currentLang].aboutUs;
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
let contactSections = document.querySelectorAll(".contactSection h3");
if (contactSections.length >= 3) {
  contactSections[0].textContent = translations[currentLang].address;
  contactSections[1].textContent = translations[currentLang].phone;
  contactSections[2].textContent = translations[currentLang].email;
}

// Update language button
let langToggleSpan = document.querySelector(".lang-toggle span");
if (langToggleSpan) {
  langToggleSpan.textContent = currentLang === "fa" ? "EN" : "فا";
}

// Update about text
updateAboutText();

// Update about us text with styling
function updateAboutText() {
  let aboutText = document.querySelector("#rightAboutUs p");
  if (aboutText) {
    if (currentLang === "fa") {
      aboutText.innerHTML =
        '<span class="brand-name">فروشگاه وایولت</span> ارائه دهنده انواع ساعت در شهر تهران است. <span class="highlight">ما با تمرکز بر سه ویژگی، یعنی: قابل اعتماد بودن، خدمات مشتری و منحصر به فرد بودن</span> در کنار شما خواهیم بود. فروشگاه وایولت در [سال] توسط [نام مؤسس] تأسیس شد، فروشگاه وایولت فعالیت خود را در شیراز آغاز کرده. هنگامی که [موسس فروشگاه] برای اولین بار شروع به فعالیت کرد، اشتیاق او به  فراهم کردن بهترین تجهیزات سوق داد. کار‌های روزانه به او انگیزه داد تا کار سخت و الهام بخش را به یک فروشگاه آنلاین پررونق تبدیل کند. <span class="highlight">ما اکنون در سرتاسر ایران به مشتریانمان خدمات ارائه می دهیم</span> امیدواریم از محصولات ما به همان اندازه که ما از ارائه آن‌ها به شما لذت می‌‌بریم لذت ببرید. اگر سوال یا نظری دارید، لطفا با ما تماس بگیرید';
    } else {
      aboutText.innerHTML =
        '<span class="brand-name">Violet Store</span> is a provider of various watches in Tehran. <span class="highlight">We focus on three features: reliability, customer service, and uniqueness.</span> Violet Store was founded in [year] by [founder name] and started its activity in Shiraz. When the founder first started, their passion drove them to provide the best equipment. Daily work motivated them to turn hard work and inspiration into a thriving online store. <span class="highlight">We now serve our customers throughout Iran</span> and hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please contact us.';
    }
  }
}

// Initialize theme and language on page load
document.addEventListener("DOMContentLoaded", function () {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const themeIcon = document.querySelector(".theme-toggle i");
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  }

  // Load saved language
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    currentLang = savedLang;
    updateLanguage();
  } else {
    // Set default language to Persian if not saved
    updateLanguage();
  }
});
