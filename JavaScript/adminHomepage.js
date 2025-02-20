document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5000/users") // Fetch data from the backend
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById("data-table");
            tableBody.innerHTML = ""; // Clear previous data
            const today = new Date();
            let expiringCount = 0;
            let subscriberCount = users.length;
            let rechargeCount = 0;
            let totalSales = 0;

            users.forEach(user => {
                user.rechargeHistory.forEach(recharge => {
                    const expiryDate = new Date(recharge.expiryDate);
                    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                    if (daysLeft <= 3) { // Display only users whose recharge expires in 3 days or less
                        const row = `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.username}</td>
                                <td>${user.mobileNumber}</td>
                                <td>${user.email}</td>
                                <td>${user.currentPlan}</td>
                                <td>${recharge.expiryDate}</td>
                                <td class="${daysLeft <= 1 ? 'text-danger fw-bold' : 'text-warning'}">${daysLeft}</td>
                            </tr>
                        `;
                        tableBody.innerHTML += row;
                        
                        expiringCount++;
                        if (daysLeft === 0) rechargeCount++;
                        totalSales += recharge.amount || 0; // Assuming amount is part of the recharge object
                    }
                });
            });

            document.getElementById("expiring-recharges").textContent = expiringCount;
            document.getElementById("subscribers").textContent = subscriberCount;
            document.getElementById("recharges").textContent = rechargeCount;
            document.getElementById("total-sales").textContent = `$${totalSales.toFixed(2)}`;
        })
        .catch(error => console.error("Error fetching data:", error));
});
