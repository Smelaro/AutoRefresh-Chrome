// Guardar el intervalo cuando el usuario lo cambie
document.getElementById("save").addEventListener("click", () => {
  const interval = document.getElementById("interval").value;
  chrome.storage.sync.set({ refreshInterval: interval }, () => {
    document.getElementById("status").innerText = `Intervalo guardado: ${interval} segundos`;
  });
});

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
