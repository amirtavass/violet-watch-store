import { api, getToken, ApiError, type Product, type PagedProducts } from "./api";
import { adminText } from "./admin-text";
import { initModal, showModal, closeModal, setOnClose } from "./modal";
import { initTheme, toggleTheme } from "./theme";

const adminToken = getToken();
if (!adminToken) {
  location.replace("/index.html");
}

let currentPage = 1;
let editingId: number | null = null;

function tbody(): HTMLTableSectionElement {
  return document.querySelector<HTMLTableSectionElement>(".products table tbody")!;
}

async function loadProducts(page = 1): Promise<void> {
  currentPage = page;
  const searchInput = document.querySelector<HTMLInputElement>("#searchTextFeild");

  try {
    const data: PagedProducts = await api.listProducts({
      name: searchInput?.value ?? "",
      page,
      pageSize: 8,
    });
    renderTable(data);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) location.replace("/index.html");
  }
}

function renderTable(data: PagedProducts): void {
  tbody().innerHTML = "";

  if (data.items.length === 0) {
    tbody().innerHTML = `<tr><td colspan='4'>${adminText.emptyTable}</td></tr>`;
    return;
  }

  for (const product of data.items) {
    const tr = document.createElement("tr");

    const imgCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = product.picUrl;
    img.alt = product.name;
    img.addEventListener("click", () => showPictureBox(product));
    imgCell.appendChild(img);

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;

    const editCell = document.createElement("td");
    const editBtn = document.createElement("span");
    editBtn.className = "button";
    editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editBtn.addEventListener("click", () => openEditForm(product));
    editCell.appendChild(editBtn);

    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("span");
    deleteBtn.className = "button";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", () => confirmDelete(product));
    deleteCell.appendChild(deleteBtn);

    tr.append(imgCell, nameCell, editCell, deleteCell);
    tbody().appendChild(tr);
  }

  const nav = document.querySelector<HTMLElement>(".products nav");
  if (!nav) return;
  nav.innerHTML = "";
  if (data.totalPages > 1) {
    for (let i = 1; i <= data.totalPages; i++) {
      const span = document.createElement("span");
      span.textContent = String(i);
      if (i === data.page) span.classList.add("navItemActive");
      span.addEventListener("click", () => void loadProducts(i));
      nav.appendChild(span);
    }
  }
}

function showPictureBox(product: Product): void {
  showModal("pictureBox");
  const img = document.querySelector<HTMLImageElement>(".pictureBox img");
  if (img) img.src = product.picUrl;
}

function confirmDelete(product: Product): void {
  editingId = product.id;
  showModal("messageBox");
}

function openEditForm(product: Product): void {
  editingId = product.id;
  showModal("editAndInsertForm");
  setFormMode("edit");
  fillForm(product);
}

function openAddForm(): void {
  editingId = null;
  showModal("editAndInsertForm");
  setFormMode("add");
  fillForm(null);
}

function setFormMode(mode: "add" | "edit"): void {
  const form = document.querySelector<HTMLElement>(".editAndInsertForm");
  const button = form?.querySelector<HTMLButtonElement>("button");
  const icon = form?.querySelector<HTMLElement>(".editAndInsertFormIcon");
  if (button) button.textContent = mode === "edit" ? adminText.editButton : adminText.addButton;
  if (icon) {
    icon.innerHTML =
      mode === "edit"
        ? '<i class="fa-solid fa-pen-to-square"></i>'
        : '<i class="fa-solid fa-circle-plus"></i>';
  }
}

function fillForm(product: Product | null): void {
  const set = (id: string, value: string): void => {
    const el = document.querySelector<HTMLInputElement>(`#${id}`);
    if (el) el.value = value;
  };
  set("idFeild", product ? String(product.id) : "");
  set("name", product?.name ?? "");
  set("case_", product?.case ?? "");
  set("strap", product?.strap ?? "");
  set("glasp", product?.glasp ?? "");
  const picInput = document.querySelector<HTMLInputElement>("#picUrl");
  if (picInput) picInput.value = "";

  const gender = product?.gender ?? "man";
  const manRadio = document.querySelector<HTMLInputElement>("#man");
  const womanRadio = document.querySelector<HTMLInputElement>("#woman");
  if (manRadio) manRadio.checked = gender === "man";
  if (womanRadio) womanRadio.checked = gender !== "man";

  const error = document.querySelector<HTMLElement>(".errorMessage");
  if (error) error.innerHTML = "";
}

function buildFormData(): FormData | null {
  const value = (id: string): string =>
    document.querySelector<HTMLInputElement>(`#${id}`)?.value ?? "";

  const name = value("name");
  const picInput = document.querySelector<HTMLInputElement>("#picUrl");
  const file = picInput?.files?.[0];

  let message = "";
  if (!name) message += adminText.validationName + "<br/>";
  if (!file && !editingId) message += adminText.validationPic + "<br/>";
  if (message) {
    const error = document.querySelector<HTMLElement>(".errorMessage");
    if (error) error.innerHTML = message;
    return null;
  }

  const form = new FormData();
  form.append("name", name);
  form.append("case_", value("case_"));
  form.append("strap", value("strap"));
  form.append("glasp", value("glasp"));
  form.append("gender", value("woman") ? "woman" : "man");
  const genderMan = document.querySelector<HTMLInputElement>("#man");
  form.set("gender", genderMan?.checked ? "man" : "woman");
  if (file) form.append("pic", file);
  return form;
}

async function saveProduct(): Promise<void> {
  const form = buildFormData();
  if (!form) return;

  try {
    if (editingId) {
      await api.updateProduct(editingId, form);
    } else {
      await api.createProduct(form);
    }
    closeModal();
    showPopup(adminText.popupDefault);
    await loadProducts(editingId ? currentPage : 1);
    editingId = null;
  } catch (err) {
    const error = document.querySelector<HTMLElement>(".errorMessage");
    if (error) error.textContent = err instanceof Error ? err.message : "error";
  }
}

async function deleteItem(): Promise<void> {
  if (!editingId) return;
  try {
    await api.deleteProduct(editingId);
    closeModal();
    showPopup(adminText.popupDefault);
    await loadProducts(currentPage);
  } catch {
    showPopup(adminText.changePassFail);
  } finally {
    editingId = null;
  }
}

function showPopup(message: string): void {
  const popup = document.querySelector<HTMLElement>(".popupMessage");
  if (!popup) return;
  const span = popup.querySelector<HTMLElement>(".message");
  if (span) span.textContent = message;
  popup.style.opacity = "1";
}

async function changePassword(): Promise<void> {
  const value = (id: string): string =>
    document.querySelector<HTMLInputElement>(`#${id}`)?.value ?? "";
  const oldPassword = value("currentPassword");
  const newPassword = value("newPassword");
  const repeated = value("repeatedPassword");

  try {
    await api.changePassword(oldPassword, newPassword, repeated);
    closeModal();
    showPopup(adminText.changePassSuccess);
  } catch (err) {
    const message = err instanceof ApiError && err.message === "password_mismatch"
      ? adminText.changePassFail
      : adminText.changePassFail;
    const el = document.querySelector<HTMLElement>(".changePassErrorMessage");
    if (el) el.textContent = message;
    showPopup(message);
  }
}

function initAdminChrome(): void {
  document.querySelector(".addSection")?.addEventListener("click", openAddForm);

  const saveButton = document.querySelector<HTMLButtonElement>(".editAndInsertForm button");
  saveButton?.addEventListener("click", () => void saveProduct());

  document.querySelector(".messageBox .cancelButton")?.addEventListener("click", closeModal);
  document.querySelector(".messageBox .okButton")?.addEventListener("click", () => void deleteItem());

  document.querySelector<HTMLButtonElement>("#changePassBtn")?.addEventListener("click", () => void changePassword());

  document.querySelectorAll<HTMLElement>(".showPassIcon").forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.parentElement?.querySelector<HTMLInputElement>("input");
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      icon.classList.toggle("active", isPassword);
    });
  });

  document.querySelector(".popupMessage .closeButton")?.addEventListener("click", (e) => {
    const popup = (e.currentTarget as HTMLElement).closest<HTMLElement>(".popupMessage");
    if (popup) popup.style.opacity = "0";
  });

  const menus = document.querySelectorAll<HTMLElement>("nav.menus a");
  menus.forEach((menu) => {
    if (!menu.getAttribute("href")) {
      menu.addEventListener("click", () => showModal("changePass"));
    }
  });

  const searchInput = document.querySelector<HTMLInputElement>("#searchTextFeild");
  let debounce: number | undefined;
  searchInput?.addEventListener("input", () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => void loadProducts(1), 350);
  });

  const ham = document.querySelector<HTMLElement>(".hambergerMenu");
  ham?.addEventListener("click", () => {
    ham.classList.toggle("activerHambergerMenu");
    document.querySelector("aside")?.classList.toggle("openAside");
  });

  document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);

  setOnClose(() => {
    editingId = null;
  });
}

initTheme();
initModal();
initAdminChrome();
void loadProducts(1);
