let deferredInstallPrompt = null;

const installBtn = document.getElementById("installBtn");
const installModal = document.getElementById("installModal");
const modalClose = document.getElementById("modalClose");
const modalAction = document.getElementById("modalAction");
const installMessage = document.getElementById("installMessage");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  installBtn.textContent = "App instalada";
  installBtn.disabled = true;
  installBtn.style.opacity = ".72";
});

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function showInstallHelp() {
  if (isStandalone()) {
    installMessage.textContent = "MORADA ya está instalada en este dispositivo.";
  } else if (isIos()) {
    installMessage.textContent = "En iPhone o iPad: toca Compartir en Safari y después “Agregar a pantalla de inicio”.";
  } else {
    installMessage.textContent = "Abre esta página en Chrome o Edge y usa la opción “Instalar app” o “Agregar a pantalla de inicio” del navegador.";
  }
  installModal.hidden = false;
}

installBtn.addEventListener("click", async () => {
  if (isStandalone()) {
    showInstallHelp();
    return;
  }

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }

  showInstallHelp();
});

function closeModal() {
  installModal.hidden = true;
}

modalClose.addEventListener("click", closeModal);
modalAction.addEventListener("click", closeModal);

installModal.addEventListener("click", (event) => {
  if (event.target === installModal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !installModal.hidden) closeModal();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
