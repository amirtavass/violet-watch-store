export type ModalName =
  | "productDetail"
  | "loginForm"
  | "aboutUs"
  | "contactUs"
  | "editAndInsertForm"
  | "changePass"
  | "messageBox"
  | "pictureBox";

let onClose: (() => void) | null = null;
let hideTimer: number | undefined;

function container(): HTMLElement | null {
  return document.querySelector<HTMLElement>(".modal .container");
}

export function showModal(name: ModalName): void {
  closeHamburger();
  const modal = document.querySelector<HTMLElement>(".modal");
  const cont = container();
  if (!modal || !cont) return;

  if (hideTimer !== undefined) {
    window.clearTimeout(hideTimer);
    hideTimer = undefined;
  }

  cont.querySelectorAll<HTMLElement>(":scope > div").forEach((el) => {
    el.style.display = "none";
  });

  const page = cont.querySelector<HTMLElement>(`.${name}`);
  if (page) {
    page.style.display =
      name === "aboutUs" || name === "contactUs" ? "flex" : "block";
  }

  modal.style.opacity = "1";
  modal.style.display = "flex";
}

export function closeModal(): void {
  const modal = document.querySelector<HTMLElement>(".modal");
  if (modal) {
    modal.style.opacity = "0";
    if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  }
  onClose?.();
  onClose = null;
}

export function setOnClose(fn: (() => void) | null): void {
  onClose = fn;
}

export function initModal(): void {
  const closeButton = document.querySelector<HTMLElement>(".modal .container > .closeButton");
  closeButton?.addEventListener("click", closeModal);

  const modal = document.querySelector<HTMLElement>(".modal");
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function closeHamburger(): void {
  const aside = document.querySelector<HTMLElement>("aside");
  const ham = document.querySelector<HTMLElement>(".hambergerMenu");
  if (aside?.classList.contains("openAside")) {
    ham?.classList.remove("activerHambergerMenu");
    aside.classList.remove("openAside");
  }
}
