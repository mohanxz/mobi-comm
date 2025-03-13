function showModal(message) {
  document.getElementById("modalMessage").innerText = message; // Insert message into modal
  let modal = new bootstrap.Modal(document.getElementById("responseModal")); // Select modal
  modal.show(); // Show modal
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("track-order-btn").style.display = "none";
});

// Validate if the user is a MobiComm user
async function validateUser(mobileNumber) {
  try {
    let response = await fetch(`http://localhost:3000/users?mobileNumber=${mobileNumber}`);
    let users = await response.json();
    return users.length > 0;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
}

// Function to submit the form and store in JSON server
async function submitForm(type) {
let formContainer = document.getElementById("form-container");
let inputs = formContainer.querySelectorAll("input");
let jsonData = {};
let otpInput = formContainer.querySelector("input[name='otp']");
let otpError = formContainer.querySelector("#otpError"); // OTP error span

// Collect form data
inputs.forEach((input) => {
    jsonData[input.name] = input.value.trim();
});

// Validate Mobile Number
if (!jsonData["mobileNumber"] || jsonData["mobileNumber"].length !== 10) {
    document.getElementById("mobileError").textContent = "Please enter a valid 10-digit mobile number.";
    return;
} else {
    document.getElementById("mobileError").textContent = ""; // Clear error
}

// Validate OTP - Show error if OTP is missing or invalid
if (!otpInput || otpInput.value.trim().length !== 6 || !/^\d{6}$/.test(otpInput.value.trim())) {
    otpError.textContent = "Please enter a valid 6-digit OTP.";
    return;
} else {
    otpError.textContent = ""; // Clear error
}

let endpoint = "";
let validateMobiComm = true; // Default: validate users

// Determine the correct API endpoint
if (type === "Customer Support") {
    endpoint = "http://localhost:3000/customerSupportRequests";
} else if (type === "Lost SIM") {
    endpoint = "http://localhost:3000/lostSimRequests";
} else if (type === "Refund Request") {
    endpoint = "http://localhost:3000/refundRequests";
}

// Validate MobiComm user only for Customer Support and Refund Request
if (validateMobiComm) {
    let isValidUser = await validateUser(jsonData["mobileNumber"]);
    if (!isValidUser) {
        document.getElementById("mobileError").textContent = "Only MobiComm users can submit this request.";
        return;
    } else {
        document.getElementById("mobileError").textContent = ""; // Clear error
    }
}

// Submit form to JSON server
try {
    let response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
    });

    if (response.ok) {
        formContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="mt-3 alert alert-success">
                <img src="success-icon.png" alt="Success" width="30" height="30">
                ${type} request submitted successfully!
            </div>`
        );
    } else {
        otpError.textContent = "Error submitting form. Please try again.";
    }
} catch (error) {
    console.error("Error submitting form:", error);
    otpError.textContent = "Network error. Please try again later.";
}
}
async function submitLostSimRequest(requestType) {
  const lostSimNumber = document.querySelector('input[name="lostSimNumber"]').value.trim();
  const aadhaarId = document.querySelector('input[name="aadhaarId"]').value.trim();
  const contactNumber = document.querySelector('input[name="contactNumber"]').value.trim();
  const otp = document.querySelector('input[name="otp"]').value.trim();

  // Basic validation
  if (!lostSimNumber || !aadhaarId || !contactNumber || !otp) {
    showModal("All fields are required.");
    return;
  }
  if (!/^\d{6}$/.test(otp)) {
      showModal("Invalid OTP. Please enter a 6-digit OTP.");
      return;
  }
  const requestData = {
      lostSimNumber,
      aadhaarId,
      contactNumber,
      otp
  };

  try {
    // Step 1: Show "Processing..." for 3 seconds
    Swal.fire({
        title: "Processing...",
        text: "Submitting your request, please wait...",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false, // Hide "OK" button during processing
        timer: 3000, // Show message for 3 seconds
        didOpen: () => {
            Swal.showLoading(); // Show loading animation
        }
    });

    // Step 2: Wait for 3 seconds before making the API request
    setTimeout(async () => {
        try {
            const response = await fetch("http://localhost:3000/lostSimRequests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                // If submission is successful, show "Success!" for 10 seconds
                Swal.fire({
                    title: "Success!",
                    text: "Lost SIM request submitted successfully!",
                    icon: "success",
                    timer: 10000, // Keep success message visible for 10 seconds
                    allowOutsideClick: false,
                    showConfirmButton: false // Hide OK button to auto-close
                }).then(() => {
                    // Ensure page refresh happens only after the success message closes
                    location.reload();
                });

            } else {
                // If submission fails, show an error message
                Swal.fire({
                    title: "Error",
                    text: "Failed to submit lost SIM request.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }, 3000); // Wait for 3 seconds before submitting the request

} catch (error) {
    console.error("Error:", error);
    Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK"
    });
}

}

async function submitRequest(requestType) {
  let endpoint = "";
  let requestData = {};

  if (requestType === "Refund Request") {
      requestData = {
          invoiceNumber: document.querySelector('input[name="invoiceNumber"]').value.trim(),
          name: document.querySelector('input[name="name"]').value.trim(),
          mobileNumber: document.querySelector('input[name="mobileNumber"]').value.trim(),
          otp: document.querySelector('input[name="otp"]').value.trim()
      };
      endpoint = "http://localhost:3000/refundRequests";
  }

  // ✅ Basic Validation: Ensure all fields are filled
  if (Object.values(requestData).some(field => !field)) {
      showModal("All fields are required.");
      return;
  }

  // ✅ Validate Mobile Number (Only 10-digit numbers allowed)
  if (!/^\d{10}$/.test(requestData.mobileNumber)) {
      showModal("Please enter a valid 10-digit mobile number.");
      return;
  }

  // ✅ (Optional) Validate Invoice Number Format (Modify if needed)
  if (!/^\d+$/.test(requestData.invoiceNumber)) {  // Ensure invoice number is numeric
      showModal("Invalid invoice number. It should contain only numbers.");
      return;
  }

  // ✅ Validate OTP (Only 6-digit numbers allowed)
  if (!/^\d{6}$/.test(requestData.otp)) {
      showModal("Invalid OTP. Please enter a 6-digit OTP.");
      return;
  }

  try {
      const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData)
      });

      if (response.ok) {
          alert(`${requestType} submitted successfully!`);

          
      } else {
          showModal(`Failed to submit ${requestType}. Please try again.`);
      }
  } catch (error) {
      console.error("Error:", error);
      showModal("An error occurred while submitting the request.");
  }
}


// Function to Show Bootstrap Modal
function showModal(message) {
  document.getElementById("modalMessage").innerText = message;
  let modal = new bootstrap.Modal(document.getElementById("responseModal"));
  modal.show();
}

// Function to dynamically generate form UI
function showForm(type) {
  let formContainer = document.getElementById("form-container");
  let formHTML = "";
  let imageSrc = "";

  // Generate the appropriate form UI
  switch (type) {
    case "customer-support":
      imageSrc = "customer-support.jpg";
      formHTML = `
    <h2>Customer Support</h2>
    
    <label>Name</label>
    <input type="text" name="name" class="form-control input-style" required>
    <span id="nameError" class="text-danger"></span>

    <label>Mobile Number</label>
    <input type="tel" name="mobileNumber" id="mobileNumber" class="form-control input-style" required oninput="validateAndToggleOtp()">
    <span id="mobileError" class="text-danger"></span>

<button id="generateOtpBtn" class="btn btn-primary mt-2" style="display: none;" 
onclick="generateOtp('otpContainer')">Generate OTP</button>

    <div id="otpContainer" style="display: none;">
        <label>Enter OTP</label>
        <input type="text" name="otp" class="form-control input-style" required>
        <span id="otpError" class="text-danger"></span>
    </div>

    <button class="btn btn-success mt-3" onclick='submitForm("Customer Support")'>Submit</button>
`;
      break;
    case "refund-request":
      imageSrc = "refund.jpg";
      formHTML = `
    <h2>Request a Refund</h2>

    <label>Invoice Number</label>
    <input type="text" name="invoiceNumber" class="form-control input-style" required>
    <span id="invoiceError" class="text-danger"></span>

    <label>Name</label>
    <input type="text" name="name" class="form-control input-style" required>
    <span id="nameError" class="text-danger"></span>

    <label>Mobile Number</label>
    <input type="tel" name="mobileNumber" id="refundMobileNumber" class="form-control input-style" required oninput="validateRefundMobile()">
    <span id="refundMobileError" class="text-danger"></span>

<button id="refundGenerateOtpBtn" class="btn btn-primary mt-2" style="display: none;" 
onclick="generateOtp('refundOtpContainer')">Generate OTP</button>

    <div id="refundOtpContainer" style="display: none;">
        <label>Enter OTP</label>
        <input type="text" name="otp" class="form-control input-style" required>
        <span id="otpError" class="text-danger"></span>
    </div>

    <button class="btn btn-success mt-3" onclick='submitRequest("Refund Request")'>Submit</button>
`;
      break;


    case "lost-sim":
      imageSrc = "lost-sim.jpg";
      formHTML = `
            <h2>Lost Your SIM?</h2>

            <!-- Lost SIM Mobile Number -->
            <label>Lost SIM Mobile Number</label>
            <input type="tel" name="lostSimNumber" id="lostSimNumber" class="form-control input-style" required oninput="validateLostSimNumber()">
            <span id="lostSimError" class="text-danger"></span>

            <!-- Aadhaar ID -->
            <label>Aadhaar ID</label>
            <input type="text" name="aadhaarId" class="form-control input-style" required>

            <!-- Contact Mobile Number -->
            <label>Contact Mobile Number</label>
            <input type="tel" name="contactNumber" id="contactNumber" class="form-control input-style" required oninput="validateContactNumber()">
            <span id="contactError" class="text-danger"></span>

            <!-- Generate OTP Button -->
            <button id="generateOtpBtnLost" class="btn btn-primary mt-2" style="display: none;" 
onclick="generateOtp('otpContainerLost')">Generate OTP</button>


            <!-- OTP Input Field -->
            <div id="otpContainerLost" style="display: none;">
                <label>Enter OTP</label>
                <input type="text" name="otp" class="form-control input-style" required>
                <span id="otpError" class="text-danger"></span>
            </div>

            <!-- Submit Button -->
            <button class="btn btn-success mt-3" onclick='submitLostSimRequest("Lost SIM")'>Submit</button>
        `;
      break;


    case "track-order":
      imageSrc = "track-order.jpg";
      formHTML = `
            <h2>Track Your Order</h2>
            <label>Tracking ID</label>
            <input type='text' id='trackingId' class='form-control input-style' required>
            <button class='btn btn-primary' onclick='validateAndShowTracking()'>Track</button>
            <div id='order-status'></div>
        `;
      break;
  }

  // Display the form
  formContainer.innerHTML = `
    <div class="row align-items-center">
        <div class="col-md-6 text-center">
            <img src="${imageSrc}" class="img-fluid" alt="${type}">
        </div>
        <div class="col-md-6">
            ${formHTML}
        </div>
    </div>`;

  // Scroll into view
  
  setTimeout(() => {
const yOffset = -180; // Adjust this value based on your header height
const y = formContainer.getBoundingClientRect().top + window.scrollY + yOffset;
window.scrollTo({ top: y, behavior: "smooth" });
}, 100);

}
async function validateAndToggleOtp() {
  let mobileInput = document.getElementById("mobileNumber");
  let mobileError = document.getElementById("mobileError");
  let generateOtpBtn = document.getElementById("generateOtpBtn");

  let mobileNumber = mobileInput.value.trim();

  if (!/^\d{10}$/.test(mobileNumber)) {
    mobileError.textContent = "Please enter a valid 10-digit mobile number.";
    generateOtpBtn.style.display = "none";
    return;
  }

  mobileError.textContent = ""; // Clear previous errors

  let isValidUser = await validateUser(mobileNumber);

  if (isValidUser) {
    generateOtpBtn.style.display = "block"; // Show OTP button
  } else {
    mobileError.textContent = "Only MobiComm users can proceed.";
    generateOtpBtn.style.display = "none";
  }
}


async function validateLostSimNumber() {
  let lostSimNumber = document.getElementById("lostSimNumber").value.trim();
  let lostSimError = document.getElementById("lostSimError");
  let generateOtpBtn = document.getElementById("generateOtpBtnLost");

  if (lostSimNumber.length !== 10) {
    lostSimError.innerText = "Mobile number must be 10 digits.";
    generateOtpBtn.style.display = "none";
    return;
  }

  let isMobiCommUser = await validateUser(lostSimNumber);
  if (!isMobiCommUser) {
    lostSimError.innerText = "Only MobiComm users can submit this request.";
    generateOtpBtn.style.display = "none";
  } else {
    lostSimError.innerText = "";
    generateOtpBtn.style.display = "block";

    validateContactNumber(); // Ensure both numbers are different
  }
}
async function validateRefundMobile() {
  let mobileInput = document.getElementById("refundMobileNumber");
  let mobileError = document.getElementById("refundMobileError");
  let generateOtpBtn = document.getElementById("refundGenerateOtpBtn");

  let mobileNumber = mobileInput.value.trim();

  if (!/^\d{10}$/.test(mobileNumber)) {
    mobileError.textContent = "Please enter a valid 10-digit mobile number.";
    generateOtpBtn.style.display = "none";
    return;
  }

  mobileError.textContent = ""; // Clear previous errors

  let isValidUser = await validateUser(mobileNumber);

  if (isValidUser) {
    generateOtpBtn.style.display = "block"; // Show OTP button
  } else {
    mobileError.textContent = "Only MobiComm users can request a refund.";
    generateOtpBtn.style.display = "none";
  }
}


// Validate Contact Number (should not be the same as Lost SIM Number)
function validateContactNumber() {
  let lostSimNumber = document.getElementById("lostSimNumber").value.trim();
  let contactNumber = document.getElementById("contactNumber").value.trim();
  let contactError = document.getElementById("contactError");
  let generateOtpBtn = document.getElementById("generateOtpBtnLost");

  if (contactNumber.length !== 10) {
    contactError.innerText = "Mobile number must be 10 digits.";
    generateOtpBtn.style.display = "none";
    return;
  }

  if (lostSimNumber === contactNumber) {
    contactError.innerText = "Lost SIM and Contact Number cannot be the same.";
    generateOtpBtn.style.display = "none";
  } else {
    contactError.innerText = "";
  }

  // Show Generate OTP button if both fields are valid
  if (lostSimNumber.length === 10 && contactNumber.length === 10 && lostSimNumber !== contactNumber) {
    generateOtpBtn.style.display = "block";
  }
}
// Generate Form HTML
function generateForm(title, fields) {
  let formHTML = `<h2>${title}</h2>`;
  fields.forEach(field => {
    formHTML += `<label>${field.label}</label>
                 <input type="${field.type}" name="${field.name}" class="form-control input-style" required>`;
  });
  formHTML += `<button class="btn btn-primary" onclick='submitForm("${title}")'>Submit</button>`;
  return formHTML;
}

function toggleGenerateOtpButton() {
  let mobileNumber = document.getElementById("mobileNumber").value.trim();
  let generateOtpBtn = document.getElementById("generateOtpBtn");

  if (mobileNumber.length === 10) { // Assuming 10-digit mobile number
    generateOtpBtn.style.display = "block";
  } else {
    generateOtpBtn.style.display = "none";
    document.getElementById("otpContainer").style.display = "none";
  }
}

// Function to show the OTP input field
function generateOtp(containerId) {
  let otpContainer = document.getElementById(containerId);
  if (otpContainer) {
    otpContainer.style.display = "block";
  }
}

// Order Tracking Validation
function validateAndShowTracking() {
  let trackingId = document.getElementById("trackingId").value.trim();
  let trackingContainer = document.getElementById("order-status");

  if (/^\d{6}$/.test(trackingId)) {
    trackingContainer.innerHTML = `
        <div class=" mt-3 p-3 border shadow-none">
            <h4 class="text-center text-primary">Order Status</h4>
            <p class="text-center font-weight-bold text-primary">AWB Number: <span class="text-secondary">${trackingId}</span></p>
            
            <div class="progress-track">
                <ul id="progressbar" class="list-unstyled">
                    <li id="step1" class="step0 active">Order placed</li>
                    <li id="step2" class="step0 active text-center">In Transit</li>
                    <li id="step3" class="step0 active text-right">Out for Delivery</li>
                    <li id="step4" class="step0 text-right">Delivered</li>
                </ul>
            </div>

            <button class="btn btn-danger mt-3 w-100" onclick="clearTracking()">Close</button>
        </div>
    `;

    setTimeout(() => {
      const yOffset = -100; 
      const y = trackingContainer.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 100);
    
  } else {
    showModal("Please enter a valid 6-digit Tracking ID");
  }
}

// Clear Tracking
function clearTracking() {
  document.getElementById("order-status").innerHTML = "";
}
