const input = document.getElementById("mobile-input");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");

const API_URL = "http://localhost:8081/auth/login"; // 🔹 Update with your backend endpoint

input.addEventListener("input", async function () {
    const value = input.value.trim();
    const length = value.length;
    const isValid = /^[6-9]\d{9}$/.test(value);

    if (length >= 8 && length <= 10) {
        errorMessage.innerText = "Please enter a valid 10-digit mobile number.";
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }

    if (isValid) {
        try {
            spinner.style.display = "block"; // Show spinner
            input.disabled = true; // Disable input while checking

            // 🔹 Send mobile number to backend for authentication
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mobicommNumber: value }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("jwtToken", data.token); // 🔹 Store JWT Token
                localStorage.setItem("loggedInUser", JSON.stringify(data));

                setTimeout(() => {
                    window.location.href = "http://127.0.0.1:5501/prepaidPage.html";
                }, 3000);

                errorMessage.style.display = "none";
            } else {
                errorMessage.innerText = "Please enter a valid MobiComm number.";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            errorMessage.innerText = "Something went wrong. Please try again later.";
            errorMessage.style.display = "block";
        } finally {
            spinner.style.display = "none";
            input.disabled = false;
        }
    } else {
        spinner.style.display = "none";

        if (length === 10) {
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 300);
        }
    }
});

// ✅ Redirect only if token is VALID
document.addEventListener("DOMContentLoaded", async () => {
    let getStartedBtn = document.querySelector(".cta-btn");

    if (getStartedBtn) {
        getStartedBtn.addEventListener("click", () => {
            window.location.href = "http://127.0.0.1:5501/newPrepaid.html";
        });
    }

    const token = localStorage.getItem("jwtToken");

    if (token) {
        try {
            const response = await fetch("http://localhost:8081/auth/validate", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                window.location.href = "http://127.0.0.1:5501/prepaidPage.html"; // ✅ Redirect only if token is valid
            } else {
                localStorage.removeItem("jwtToken"); // ❌ Remove invalid token
                console.warn("Invalid token. Please log in again.");
            }
        } catch (error) {
            console.error("Token validation error:", error);
        }
    }
});




const banners = [
    {
        title: "Recharge Instantly with MobiComm",
        text: "Fast, secure, and easy mobile recharges. Get exciting offers on every top-up!",
        image: "src/images/slide1.jpg"
    },
    {
        title: "Exclusive Discounts on Prepaid Plans",
        text: "Enjoy up to 20% off on selected mobile recharge plans!",
        image: "src/images/slide-2.jpg"
    },
    {
        title: "24/7 Customer Support",
        text: "We're here to help you with your recharge anytime, anywhere.",
        image: "src/images/slide-3.jpg"
    }
];

let index = 0;
function changeBanner() {
    const titleElement = document.getElementById("bannerTitle");
    const textElement = document.getElementById("bannerText");
    const imageElement = document.getElementById("bannerImage");

    titleElement.style.opacity = "0";
    textElement.style.opacity = "0";
    imageElement.style.opacity = "0";

    setTimeout(() => {
        titleElement.innerText = banners[index].title;
        textElement.innerText = banners[index].text;

        imageElement.onload = () => {
            imageElement.style.opacity = "1"; // Fade in image after loading
        };

        imageElement.src = banners[index].image; // Change the image source
        titleElement.style.opacity = "1";
        textElement.style.opacity = "1";

        index = (index + 1) % banners.length;
    }, 500);
}


changeBanner();
setInterval(changeBanner,3500);


function startSimAnimation(event, button, url) {
    event.stopPropagation(); // Prevent unintended events
    let card = button.closest(".card");
    if (card.classList.contains("activated")) return;

    let simSlot = card.querySelector(".sim-slot");
    let towerIcon = card.querySelector(".tower-icon");

    // Move SIM inside the card
    simSlot.style.transform = "translateX(0px)";
    simSlot.style.backgroundColor="#d52136"
    simSlot.style.color="#fff"

    // After 1.5s, activate the card and show the tower
    setTimeout(() => {
        card.classList.add("activated");
        towerIcon.style.opacity = "1";

        // Navigate to the page after animation
        setTimeout(() => {
            window.location.href = url;
        }, 1000);
    }, 1500);
}