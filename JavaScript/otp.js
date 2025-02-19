

document.addEventListener("DOMContentLoaded", function () {
    const sendOtpButton = document.querySelector(".btn-dark");
    const inputField = document.querySelector(".input-group input");
    const otpContainer = document.querySelector(".otp-container");

    let clickOccur = 0;

    sendOtpButton.addEventListener("click", function () {
        const mobileNumber = inputField.value.trim();
        const errorSpan = document.querySelector(".error-message");

        if (errorSpan) {
            errorSpan.remove();
        }

        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(mobileNumber)) {
            const errorMessage = document.createElement("span");
            errorMessage.textContent = "Please enter a valid 10-digit mobile number.";
            errorMessage.classList.add("text-danger", "error-message", "d-block", "mt-2");
            otpContainer.innerHTML = "";
            otpContainer.appendChild(errorMessage);
            return;
        }

        sendOtpButton.disabled = true;
        sendOtpButton.innerHTML = `Sending OTP <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>`;

        setTimeout(() => {
            sendOtpButton.disabled = false;
            sendOtpButton.innerHTML = "Resend OTP";

            otpContainer.innerHTML = "";

            const newSuccessMsg = document.createElement("span");
            newSuccessMsg.textContent = "OTP sent successfully.";
            newSuccessMsg.classList.add("text-done", "d-block", "mt-2", "w-75", "success-message");

            otpContainer.appendChild(newSuccessMsg);

            // OTP Input
            const otpInput = document.createElement("input");
            otpInput.setAttribute("type", "number");
            otpInput.setAttribute("placeholder", "Enter OTP");
            otpInput.setAttribute("maxlength", "6");
            otpInput.setAttribute("inputmode", "numeric");
            otpInput.classList.add("form-control", "mt-2", "border", "border-warning", "rounded-3", "otp-input");

            otpContainer.appendChild(otpInput);

            otpInput.addEventListener("input", () => {
                if (otpInput.value.length === 6) {
                    otpInput.disabled = true;

                    const spinner = document.createElement("span");
                    spinner.innerHTML = `<span class="spinner-border spinner-border-sm mt-2" role="status" aria-hidden="true"></span>`;

                    otpContainer.appendChild(spinner);

                    setTimeout(() => {
                        window.location.href = "http://127.0.0.1:5500/prepaidPage.html";
                    }, 3000);
                }
            });

            if (clickOccur >= 1) {
                sendOtpButton.disabled = true;
            } else {
                clickOccur++;
            }
        }, 2500);
    });
});
