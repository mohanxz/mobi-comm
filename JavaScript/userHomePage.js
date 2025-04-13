const input = document.getElementById("mobile-input");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");

const LOGIN_API = "http://localhost:8081/auth/user/login";  // Login API
const USER_API = "http://localhost:8081/api/users/mobile/"; // Get User API

let debounceTimer;

// ✅ Improved Debounce - Only calls API if exactly 10 digits entered
input.addEventListener("input", function () {
    clearTimeout(debounceTimer);

    const value = input.value.trim();
    if (value.length > 10) {
        input.value = value.slice(0, 10); // Prevents user from typing more than 10 digits
    }

    debounceTimer = setTimeout(() => {
        if (value.length === 10) {
            handleUserInput();
        }
    }, 500);
});

async function handleUserInput() {
    const value = input.value.trim();
    const isValid = /^[6-9]\d{9}$/.test(value);

    // ✅ Improved Error Message for Invalid Number
    if (!isValid) {
        errorMessage.innerText = "Please enter a valid 10-digit mobile number.";
        errorMessage.style.display = "block";
        return;
    } else {
        errorMessage.style.display = "none";
    }

    try {
        spinner.style.display = "block";
        input.disabled = true;

        // ✅ Step 1: Login & Get Token
        const loginResponse = await fetch(LOGIN_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobicommNumber: value }),
        });

        if (!loginResponse.ok) {
            errorMessage.innerText = "Invalid mobile number. Please try again.";
            errorMessage.style.display = "block";
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;

        // ✅ Secure Token Storage
        localStorage.setItem("token", token);

        // ✅ Step 2: Fetch User Details with JWT Token
        const userResponse = await fetch(USER_API + value, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!userResponse.ok) {
            if (userResponse.status === 403) {
                localStorage.removeItem("token"); //  Clear token immediately if unauthorized
                errorMessage.innerText = "Session expired. Please log in again.";
            } else if (userResponse.status === 404) {
                errorMessage.innerText = "User not found.";
            } else {
                errorMessage.innerText = `Error: ${userResponse.status}`;
            }
            errorMessage.style.display = "block";
            return;
        }

        const userData = await userResponse.json();

        // ✅ Redirect to prepaid page with user details
        const queryParams = new URLSearchParams({
            userId: userData.userId,
            username: userData.fullName,
            mobicommNumber: userData.mobicommNumber,
            email: userData.email,
            role: loginData.role
        }).toString();

        setTimeout(() => {
            window.location.href = `prepaidPage.html?${queryParams}`;
        }, 2000);

    } catch (error) {
        console.error("Error logging in or fetching user details:", error);
        errorMessage.innerText = "Server error. Try again later.";
        errorMessage.style.display = "block";
    } finally {
        spinner.style.display = "none";
        input.disabled = false;
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    let getStartedBtn = document.querySelector(".cta-btn");

    if (getStartedBtn) {
        getStartedBtn.addEventListener("click", () => {
            window.location.href = "newPrepaid.html";
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
                window.location.href = "prepaidPage.html"; 
            } else {
                localStorage.removeItem("jwtToken"); 
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

