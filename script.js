const statusButton = document.querySelector("#statusButton");

/**
 * Shows a short local confirmation that the clean rebuild baseline is active.
 */
function showReadyState() {
  statusButton.textContent = "Чистая основа активна";
  statusButton.disabled = true;
}

statusButton?.addEventListener("click", showReadyState);
