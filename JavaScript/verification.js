const input = document.getElementById("mobile-input");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");

input.addEventListener("input", function () {
    const value = input.value.trim();
    const isValid = /^[6-9]\d{9}$/.test(value);

    if (isValid) {
        input.classList.remove("shake");
        input.classList.add("success");
        errorMessage.style.display = "none"; // Hide error message
        
        // Show spinner and auto-login
        spinner.style.display = "block";
        input.disabled = true; // Prevent further input
        
        setTimeout(() => {
            window.location.href = "http://127.0.0.1:5501/prepaidPage.html"; // Redirects to dashboard
        }, 3000);
    } else {
        input.classList.remove("success");
        spinner.style.display = "none"; // Hide spinner if invalid
        errorMessage.style.display = "block"; // Show error message
        
        if (value.length === 10) {
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 300);
        }
    }
});