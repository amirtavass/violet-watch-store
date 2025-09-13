import { ajax } from "./ajax";
import { currentMode, productsData, currentLang, translations } from "./config";
import { showModal } from "./modal";

let searchedValue;

export function selectPage(page) {
  searchedValue = document.getElementById("searchTextFeild").value;
  let products = document.querySelector(".products");
  ajax("select", "", searchedValue, "", "", "", "", currentMode, page);

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
    //old code
    // products.innerHTML =
    //   `<div class="product" onclick="showModal('productDetail',${x})">
    //                                 <img src="${productsData[x].picUrl}" alt="">
    //                                 <div class="cover"></div>
    //                                 <div class="textSection">
    //                                 <span>${translations[currentLang].model}</span>
    //                                 <span>${productName}</span>
    //                                 </div>
    //                              </div>` + products.innerHTML;

    //new code
    // Create product card with click handler
    let productCard = document.createElement("div");
    productCard.className = "product";
    productCard.innerHTML = `
      <img src="${productsData[x].picUrl}" alt="">
      <div class="cover"></div>
      <div class="textSection">
        <span>${translations[currentLang].model}</span>
        <span>${productName}</span>
      </div>
    `;

    // Add click event
    productCard.addEventListener("click", () => showModal("productDetail", x));

    products.insertBefore(productCard, products.firstChild);
  }
  let nav = document.querySelector(".products nav");
  let pageCount = productsData[productsData.length - 1].pages;
  if (pageCount > 1) {
    for (let i = 0; i < pageCount; i++) {
      //old code
      // nav.innerHTML += `<span onClick="selectPage(${i + 1})">${i + 1}</span>`;
      //new code
      let pageBtn = document.createElement("span");
      pageBtn.textContent = i + 1;
      pageBtn.addEventListener("click", () => selectPage(i + 1));
      nav.appendChild(pageBtn);
    }
    document
      .querySelector(`.products nav span:nth-of-type(${page})`)
      .classList.add("navItemActive");
  }
}
