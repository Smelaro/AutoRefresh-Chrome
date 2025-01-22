let intervalId = null; // Para almacenar el ID del intervalo
let refreshInterval = 300000; // Intervalo en milisegundos (15 segundos)

// Escucha mensajes desde popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startAutoRefresh") {
    // Inicia el auto-refresh
    if (!intervalId) {
      intervalId = setInterval(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0 && tabs[0]?.id) {
            chrome.tabs.reload(tabs[0].id, () => {
              console.log(`Pestaña ${tabs[0].id} recargada.`);
            });
          } else {
            console.warn("No hay pestañas activas o disponibles.");
          }
        });
      }, refreshInterval);
    }
    sendResponse({ status: "Auto-refresh activado" });
  } else if (request.action === "stopAutoRefresh") {
    // Detiene el auto-refresh
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    sendResponse({ status: "Auto-refresh desactivado" });
  }
});
