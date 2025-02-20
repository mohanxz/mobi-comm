const input = document.getElementById("mobile-input");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");

input.addEventListener("input", function () {
    const value = input.value.trim();
    const length = value.length;
    const isValid = /^[6-9]\d{9}$/.test(value);

    if (length >= 8 && length <= 10) {
        errorMessage.style.display = "block"; // Show error message when input is between 8-10 digits
    } else {
        errorMessage.style.display = "none"; // Hide error message otherwise
    }

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

        if (length === 10) {
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 300);
        }
    }
});

document.addEventListener('DOMContentLoaded',()=>{
    let getStartedBtn=document.querySelector('.cta-btn');
    if(getStartedBtn){
        getStartedBtn.addEventListener('click',()=>{
            window.location.href="http://127.0.0.1:5501/newPrepaid.html";
        });

    }

})



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