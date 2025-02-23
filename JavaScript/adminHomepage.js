const displayTime = document.querySelector(".display-time");

function showTime() {
  let time = new Date();
  displayTime.innerText = time.toLocaleTimeString("en-US", {
    hour12: true, 
    hour: "2-digit",
    minute: "2-digit",
  });
  setTimeout(showTime, 1000);
}

showTime();

function updateDate() {
  let today = new Date();

  let dayName = today.getDay(),
    dayNum = today.getDate(),
    month = today.getMonth(),
    year = today.getFullYear();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  const IDCollection = ["day", "daynum", "month", "year"];
  const val = [dayWeek[dayName], dayNum, months[month], year];

  for (let i = 0; i < IDCollection.length; i++) {
    document.getElementById(IDCollection[i]).textContent = val[i];
  }
}

updateDate();



document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
            let expiringCount = 0, subscriberCount = users.length, rechargeCount = 0, totalSales = 0;
            let yesterdayExpiring = 50, yesterdaySubscribers = 200, yesterdayRecharges = 150, yesterdaySales = 10000;

            const today = new Date();
            const expiringTableBody = document.getElementById("expiring-users-table");
            expiringTableBody.innerHTML = "";
            let index=0
            users.forEach(user => {
                user.rechargeHistory.forEach(recharge => {
                    const expiryDate = new Date(recharge.expiryDate);
                    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                    if (daysLeft <= 3 && daysLeft > 0) {
                        expiringCount++;
                        const row = document.createElement("tr");
                        row.classList.add(daysLeft === 0 ? 'table-danger' : 'table-warning');
                        row.setAttribute("data-user-id", user.id);

                        row.innerHTML = `
                            <td>${++index}</td>
                            <td>${user.username}</td>
                            <td>${user.mobileNumber}</td>
                            <td>${user.email}</td>
                            <td>${user.currentPlan}</td>
                            <td>${recharge.expiryDate}</td>
                            <td class="fw-bold">${daysLeft}</td>

                        `;

                        expiringTableBody.appendChild(row);
                    }

                    if (daysLeft === 0) rechargeCount++;
                    totalSales += recharge.amount || 0;
                });
            });

            // Update UI Elements
            document.getElementById("expiring-recharges").textContent = expiringCount;
            document.getElementById("subscribers").textContent = subscriberCount;
            document.getElementById("recharges").textContent = rechargeCount;
            document.getElementById("total-sales").textContent = `₹${totalSales.toFixed(2)}`;

            // 🔥 Attach event listeners after table update (Delayed)
            setTimeout(() => {
                attachTableEventListeners(users);
            }, 300);

            // Function to calculate percentage change
            function calculatePercentage(today, yesterday) {
                if (yesterday === 0) return today > 0 ? "+100%" : "0%";
                let change = ((today - yesterday) / yesterday) * 100;
                return `${change.toFixed(2)}%`;
            }

            // Function to update percentage UI
            function updatePercentage(id, today, yesterday) {
                let percentage = calculatePercentage(today, yesterday);
                let element = document.getElementById(id);
                element.textContent = percentage;
                element.classList.toggle("text-success", today >= yesterday);
                element.classList.toggle("text-danger", today < yesterday);
            }

            // Update percentage elements
            updatePercentage("expiring-percentage", expiringCount, yesterdayExpiring);
            updatePercentage("subscribers-percentage", subscriberCount, yesterdaySubscribers);
            updatePercentage("recharges-percentage", rechargeCount, yesterdayRecharges);
            updatePercentage("sales-percentage", totalSales, yesterdaySales);
        });

    function attachTableEventListeners(users) {
        const rows = document.querySelectorAll("#expiring-users-table tr");
        rows.forEach(row => {
            row.addEventListener("click", function () {
                const userId = this.getAttribute("data-user-id");
                const user = users.find(u => u.id == userId);
                if (user) displayUserDetails(user);
            });
        });
        console.log("Event listeners attached to table rows!");
    }
    
    let index=0;
    function displayUserDetails(user) {
        const detailsContainer = document.getElementById("user-details-container");
        
        detailsContainer.innerHTML = `
        <div class=" card p-3 border shadow">
                <div class="row d-flex">
                    <div class="col">
                        <h4 class="text-primary">Mobi-comm Subscriber</h4>
                        <p><strong>ID:</strong> ${user.id}</p>
                        <p><strong>Username:</strong> ${user.username}</p>
                        <p><strong>Mobile:</strong> ${user.mobileNumber}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Current Plan:</strong> ${user.currentPlan}</p>
                        <p><strong>Wallet Balance:</strong> ₹${user.walletAmount}</p>

                    </div>
                    <div class="col">
                        <!-- Logo -->
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="src/images/mobi-comm-logo-removebg-preview.png" alt="Mobicom Logo"
                            style="width: 120px; height: auto;"><br>
                            <img src="src/images/mobi-comm-named-logo-removebg-preview.png" alt="" style="width: 220px;">
                            
                                </div>
                                
                                <!-- User Information -->
                                <h2 style="text-align: center; color: #d52136; margin-bottom: 10px;">User Details Report</h2>
                                <p style="text-align: center; font-size: 14px; color: #555;">
                                 Time : <span id="timestamp"></span>
                                </p>
                                </div>
                                
                                <button onclick="captureContainerAsImage()">Download </button>
                                
                                </div>
                                </div>
                                `;
                                document.getElementById("timestamp").innerText = new Date().toLocaleString();
        detailsContainer.style.display = "block"; // Make sure it's visible
    }

    // Sidebar Toggle for Mobile
    const sidebarToggleBtn = document.querySelector("#sidebarToggleBtn");
    const offcanvasSidebar = new bootstrap.Offcanvas(document.getElementById("mobileSidebar"));

    sidebarToggleBtn.addEventListener("click", function () {
        offcanvasSidebar.toggle();
    });
});


function captureContainerAsImage() {
    let container = document.getElementById("user-details-container"); // Select the container

    html2canvas(container, { scale: 2 }).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png"); // Convert to PNG
        link.download = "MobiComm_User_Details.png"; // File name
        link.click();
    });
}


function downloadStyledContainerAsPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // 🔹 Add Mobicom Logo
    let logo = new Image();
    logo.src = "src/images/mobi-comm-named-logo-removebg-preview.png";
    
    // Draw logo once loaded
    logo.onload = function () {
        doc.addImage(logo, "PNG", 80, 10, 50, 20); // Positioning Logo

        // 🔹 Add Title & Timestamp
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("User Details Report", 70, 40);
        
        let date = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(`Time : ${date}`, 70, 45);

        // 📌 Extract Table Data
        let table = document.getElementById("expiring-users-table");
        let rows = table.querySelectorAll("tr");

        let data = [];
        rows.forEach(row => {
            let rowData = [];
            row.querySelectorAll("td, th").forEach(cell => rowData.push(cell.innerText));
            data.push(rowData);
        });

        // 🎨 Styled Table
        doc.autoTable({
            startY: 50, // Push table below title
            head: [data[0]], // Table headers
            body: data.slice(1), // Table body
            theme: "striped", // Grid, plain, or striped
            styles: { fontSize: 12, cellPadding: 5 },
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }, // Dark blue header
            alternateRowStyles: { fillColor: [240, 240, 240] } // Light grey alternating rows
        });

        // 📄 Footer with Page Number
        let pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${pageCount}`, 180, 285);
        }

        doc.save("user_details_report.pdf");
    };
}





    function filterTable() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let table = document.getElementById("expiring-users-table");
        let rows = table.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
            let username = rows[i].getElementsByTagName("td")[1]?.textContent.toLowerCase();
            let email = rows[i].getElementsByTagName("td")[3]?.textContent.toLowerCase();

            if (username && email) {
                // Show row if ANY letter in input matches either username or email
                if (username.includes(input) || email.includes(input) || input === "") {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }
    }

