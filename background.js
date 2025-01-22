let intervalId = null; // Para almacenar el ID del intervalo
let refreshInterval = 300000; // Intervalo en milisegundos (15 segundos)
let remainingTime = refreshInterval; // Tiempo restante para el auto-refresh

// Función para actualizar el badge (ícono de la extensión)
function updateBadge() {
  const seconds = Math.floor(remainingTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  const timeString = `${minutes.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
  
  // Actualiza el texto del badge
  chrome.action.setBadgeText({ text: timeString });
  chrome.action.setBadgeBackgroundColor({ color: '#FF0000' }); // Color de fondo del badge (rojo)

  if (remainingTime <= 0) {
    // Recarga la página cuando el tiempo llegue a 0
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0]?.id) {
        chrome.tabs.reload(tabs[0].id); // Recarga la pestaña activa
      }
    });

    // Reinicia el temporizador
    remainingTime = refreshInterval;
  } else {
    remainingTime -= 1000; // Decrementa el tiempo en 1 segundo
  }
}

// Escucha mensajes desde popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startAutoRefresh") {
    // Inicia el auto-refresh
    if (!intervalId) {
      intervalId = setInterval(updateBadge, 1000); // Actualiza el badge cada segundo
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
