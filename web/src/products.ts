import { api, type Product, type PagedProducts } from "./api";
import { t } from "./i18n";
import { showModal } from "./modal";

let currentGender = "";

export function setGender(gender: string): void {
  currentGender = gender;
}

export function getGender(): string {
  return currentGender;
}

export async function loadProducts(page = 1): Promise<void> {
  const productsEl = document.querySelector<HTMLElement>(".products");
  const searchInput = document.querySelector<HTMLInputElement>("#searchTextFeild");
  if (!productsEl) return;

  try {
    const data = await api.listProducts({
      name: searchInput?.value ?? "",
      gender: currentGender,
      page,
      pageSize: 6,
    });
    render(data, productsEl);
  } catch {
    productsEl.innerHTML = `<nav>${t("notFound")}</nav>`;
  }
}

function render(data: PagedProducts, productsEl: HTMLElement): void {
  productsEl.innerHTML = "";

  if (data.items.length === 0) {
    productsEl.innerHTML = `<nav>${t("notFound")}</nav>`;
    return;
  }

  for (const product of data.items) {
    const card = document.createElement("div");
    card.className = "product";

    const img = document.createElement("img");
    img.src = product.picUrl;
    img.alt = product.name;

    const cover = document.createElement("div");
    cover.className = "cover";

    const text = document.createElement("div");
    text.className = "textSection";
    const label = document.createElement("span");
    label.textContent = t("model");
    const name = document.createElement("span");
    name.textContent = product.name;
    text.append(label, name);

    card.append(img, cover, text);
    card.addEventListener("click", () => showProductDetail(product));
    productsEl.appendChild(card);
  }

  const nav = document.createElement("nav");
  if (data.totalPages > 1) {
    for (let i = 1; i <= data.totalPages; i++) {
      const span = document.createElement("span");
      span.textContent = String(i);
      if (i === data.page) span.classList.add("navItemActive");
      span.addEventListener("click", () => loadProducts(i));
      nav.appendChild(span);
    }
  }
  productsEl.appendChild(nav);
}

export function showProductDetail(product: Product): void {
  showModal("productDetail");
  const img = document.querySelector<HTMLImageElement>(".productDetail img");
  if (img) img.src = product.picUrl;

  const descriptions = document.querySelectorAll<HTMLElement>(".productDetail .description");
  const values = [product.name, product.case, product.strap, product.glasp];
  descriptions.forEach((el, i) => {
    if (values[i] !== undefined) el.textContent = values[i];
  });
}
