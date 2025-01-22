let intervalId = null; // Para almacenar el ID del intervalo
let remainingTime = 0; // Tiempo restante para el auto-refresh

// Cargar el intervalo desde chrome.storage cuando la extensión se inicia
chrome.storage.sync.get(['refreshInterval'], (result) => {
  if (result.refreshInterval) {
    remainingTime = result.refreshInterval * 1000; // Convertir a milisegundos
  } else {
    remainingTime = 15000; // Valor por defecto si no hay configuración previa
  }
});

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
    // Recarga todas las pestañas de todas las ventanas
    chrome.windows.getAll({ populate: true }, (windows) => {
      windows.forEach((window) => {
        window.tabs.forEach((tab) => {
          chrome.tabs.reload(tab.id); // Recarga todas las pestañas abiertas
        });
      });
    });

    // Reinicia el temporizador al intervalo configurado
    chrome.storage.sync.get(['refreshInterval'], (result) => {
      if (result.refreshInterval) {
        remainingTime = result.refreshInterval * 1000; // Nuevo intervalo configurado
      } else {
        remainingTime = 15000; // Valor por defecto
      }
    });
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
    // Detiene el auto-refresh y reinicia el temporizador
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    // Reinicia el temporizador desde 0
    remainingTime = 0;
    sendResponse({ status: "Auto-refresh desactivado y reiniciado" });
  }
});
