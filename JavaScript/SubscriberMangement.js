// document.addEventListener("DOMContentLoaded", function () {
//     fetch("http://localhost:3000/users")
//         .then(response => response.json())
//         .then(users => {
//             let subscriberTable = document.getElementById("subscribers-table");
//             subscriberTable.innerHTML = "";
//             let index = 0;

//             users.forEach(user => {
//                 const row = document.createElement("tr");
//                 row.setAttribute("data-user-id", user.id);

//                 row.innerHTML = `
//                     <td>${++index}</td>
//                     <td>${user.username}</td>
//                     <td>${user.mobileNumber}</td>
//                     <td>${user.email}</td>
//                     <td>${user.currentPlan}</td>
//                     <td>${user.rechargeHistory.length}</td>
//                     <td>₹${user.walletAmount}</td>
//                     <td class="fw-bold text-${user.status === 'Active' ? 'success' : 'danger'}">${user.status}</td>
//                 `;

//                 row.addEventListener("click", function () {
//                     displayUserDetails(user);
//                 });

//                 subscriberTable.appendChild(row);
//             });

//             document.getElementById("total-subscribers").textContent = users.length;
//         });
// });

// // 📌 Display user details in a separate container
// function displayUserDetails(user) {
//     const detailsContainer = document.getElementById("subscriber-details-container");

//     detailsContainer.innerHTML = `
//         <div class="card p-3 border shadow">
//             <div class="row d-flex">
//                 <div class="col">
//                     <h4 class="text-primary">Mobi-comm Subscriber</h4>
//                     <p><strong>ID:</strong> ${user.id}</p>
//                     <p><strong>Username:</strong> ${user.username}</p>
//                     <p><strong>Mobile:</strong> ${user.mobileNumber}</p>
//                     <p><strong>Email:</strong> ${user.email}</p>
//                     <p><strong>Current Plan:</strong> ${user.currentPlan}</p>
//                     <p><strong>Wallet Balance:</strong> ₹${user.walletAmount}</p>
//                 </div>
//                 <div class="col text-center">
//                     <img src="src/images/mobi-comm-logo-removebg-preview.png" alt="Mobicom Logo"
//                     style="width: 120px; height: auto;"><br>
//                     <img src="src/images/mobi-comm-named-logo-removebg-preview.png" alt="" style="width: 220px;">
//                 </div>
//             </div>

//             <div class="mt-3">
//                 <h5 class="text-secondary">Recharge History</h5>
//                 <table class="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Date</th>
//                             <th>Amount (₹)</th>
//                             <th>Payment Mode</th>
//                             <th>Transaction ID</th>
//                             <th>Expiry Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${user.rechargeHistory.map(recharge => `
//                             <tr>
//                                 <td>${recharge.date}</td>
//                                 <td>${recharge.amount}</td>
//                                 <td>${recharge.paymentMode}</td>
//                                 <td>${recharge.transactionId}</td>
//                                 <td>${recharge.expiryDate}</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>

//             <button onclick="downloadUserDetails()" class="btn btn-primary mt-2">Download</button>
//         </div>
//     `;

//     detailsContainer.style.display = "block";
// }

// // 📌 Download a single user's details as an image
// function downloadUserDetails() {
//     let container = document.getElementById("subscriber-details-container");

//     html2canvas(container, { scale: 2 }).then(canvas => {
//         let link = document.createElement("a");
//         link.href = canvas.toDataURL("image/png");
//         link.download = `MobiComm_${new Date().toISOString()}.png`;
//         link.click();
//     });
// }

// // 📌 Bulk download all users as a PDF
// function downloadAllUsersAsPDF() {
//     const { jsPDF } = window.jspdf;
//     let doc = new jsPDF();

//     let logo = new Image();
//     logo.src = "src/images/mobi-comm-named-logo-removebg-preview.png";

//     logo.onload = function () {
//         doc.addImage(logo, "PNG", 80, 10, 50, 20);

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(16);
//         doc.text("Overall Subscribers Report", 60, 40);

//         let date = new Date().toLocaleString();
//         doc.setFontSize(10);
//         doc.text(`Generated on: ${date}`, 70, 45);

//         let table = document.getElementById("subscribers-table");
//         let rows = table.querySelectorAll("tr");

//         let data = [];
//         rows.forEach(row => {
//             let rowData = [];
//             row.querySelectorAll("td, th").forEach(cell => rowData.push(cell.innerText));
//             data.push(rowData);
//         });

//         doc.autoTable({
//             startY: 50,
//             head: [data[0]],
//             body: data.slice(1),
//             theme: "striped",
//             styles: { fontSize: 12, cellPadding: 5 },
//             headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
//             alternateRowStyles: { fillColor: [240, 240, 240] }
//         });

//         let pageCount = doc.internal.getNumberOfPages();
//         for (let i = 1; i <= pageCount; i++) {
//             doc.setPage(i);
//             doc.setFontSize(10);
//             doc.text(`Page ${i} of ${pageCount}`, 180, 285);
//         }

//         doc.save("Subscribers_Report.pdf");
//     };
// }
