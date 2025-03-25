document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error("AuthToken not found in localStorage.");
        return;
    }

    // Helper function to fetch data with Authorization header
    async function fetchData(url, options = {}) {
        const defaultOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${url} - ${response.statusText}`);
            }

            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (error) {
                console.warn(`Non-JSON response from ${url}:`, text);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    }

    try {
        const users = await fetchData("http://localhost:8081/api/users/expiring-recharges") || [];
        const rechargeData = await fetchData("http://localhost:8081/api/recharges") || [];

        let expiringCount = 0;
        const today = new Date();
        const todayRecharges = rechargeData.filter(recharge => {
            const rechargeDate = new Date(recharge.startDate);
            return rechargeDate.toDateString() === today.toDateString();
        });

        let totalSales = rechargeData.reduce((sum, recharge) => sum + (recharge.amountPaid || 0), 0);
        const expiringTableBody = document.getElementById("user-table");
        expiringTableBody.innerHTML = "";

        let index = 0;

        users.forEach(user => {
            const userRecharges = rechargeData.filter(r => r.userId === user.userId);
            
            userRecharges.forEach(recharge => {
                const expiryDate = new Date(recharge.expiryDate);
                const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                if (daysLeft <= 3) {
                    expiringCount++;
                    const row = document.createElement("tr");
                    row.classList.add(daysLeft === 0 ? 'table-danger' : 'table-warning');
                    row.setAttribute("data-user-id", user.userId);

                    row.innerHTML = `
                        <td>${++index}</td>
                        <td>${user.fullName}</td>
                        <td>${user.mobicommNumber}</td>
                        <td>${user.email}</td>
                        <td>${user.currentPlanId}</td>
                        <td>${formatDate(recharge.expiryDate)}</td>
                        <td class="fw-bold">${daysLeft}</td>
                    `;

                    expiringTableBody.appendChild(row);
                }
            });
        });

        // Fetch and update total subscribers
        async function fetchTotalSubscribers() {
            try {
                const users = await fetchData("http://localhost:8081/api/users");
                document.getElementById('subscribers').textContent = users ? users.length : "N/A";
            } catch (error) {
                console.error('Error fetching subscribers:', error);
                document.getElementById('subscribers').textContent = 'Error!';
            }
        }
        fetchTotalSubscribers();

        // Update UI Elements
        document.getElementById("expiring-recharges").textContent = expiringCount;
        document.getElementById("recharges").textContent = todayRecharges.length;
        document.getElementById("total-sales").textContent = `₹${totalSales.toFixed(2)}`;

        setTimeout(() => {
            attachTableEventListeners(users, rechargeData);
        }, 300);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

function attachTableEventListeners(users, recharges) {
    document.querySelectorAll("#user-table tr").forEach(row => {
        row.addEventListener("click", function () {
            const userId = parseInt(this.getAttribute("data-user-id"));
            const user = users.find(u => u.userId === userId);
            const userRecharges = recharges.filter(r => r.userId === userId);

            if (user) displayUserDetails(user, userRecharges);
        });
    });
    console.log("Event listeners attached to table rows!");
}

function displayUserDetails(user, recharges) {
    const detailsContainer = document.getElementById("user-details-container");
    detailsContainer.innerHTML = `
        <div class="card p-3 border shadow">
            <div class="row d-flex">
                <div class="col">
                    <h4 class="text-danger">Mobi-comm Subscriber</h4>
                    <p><strong>ID:</strong> ${user.userId}</p>
                    <p><strong>Full Name:</strong> ${user.fullName}</p>
                    <p><strong>Mobile:</strong> ${user.mobicommNumber}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Current Plan ID:</strong> ${user.currentPlanId}</p>
                </div>
            </div>
            <div class="mt-3">
                <h5 class="text-secondary">Recharge History</h5>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Amount (₹)</th>
                            <th>Payment Mode</th>
                            <th>Transaction ID</th>
                            <th>Start Date</th>
                            <th>Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recharges.map(recharge => `
                            <tr>
                                <td>${recharge.amountPaid}</td>
                                <td>${recharge.paymentMode}</td>
                                <td>${recharge.transactionId}</td>
                                <td>${formatDate(recharge.startDate)}</td>
                                <td>${formatDate(recharge.expiryDate)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    detailsContainer.style.display = "block";
}

function formatDate(sqlDate) {
    if (!sqlDate) return "N/A";
    const date = new Date(sqlDate);
    return date.toLocaleDateString("en-GB");
}
