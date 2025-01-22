// Función para iniciar el auto-refresh
document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startAutoRefresh" }, (response) => {
    document.getElementById("status").innerText = `Estado: ${response.status}`;
  });
});

// Función para detener el auto-refresh
document.getElementById("stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stopAutoRefresh" }, (response) => {
    document.getElementById("status").innerText = `Estado: ${response.status}`;
  });
});
