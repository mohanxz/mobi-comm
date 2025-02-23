async function checkAndAddExpiringUsers() {
    try {
        // Fetch current user data
        let response = await fetch("http://localhost:5000/users");
        let data = await response.json();

        let today = new Date();
        let expiringUsers = [];

        // Loop through users and check their expiry
        data.users.forEach(user => {
            user.rechargeHistory.forEach(recharge => {
                let expiryDate = new Date(recharge.expiryDate);
                let daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                if (daysLeft <= 3) {
                    expiringUsers.push(user);
                }
            });
        });

        // If new expiring users exist, push them to JSON file
        if (expiringUsers.length > 0) {
            await fetch("http://localhost:5000/updateUsers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ users: expiringUsers }),
            });

            console.log("Expiring users added to JSON file:", expiringUsers.length);
        }
    } catch (error) {
        console.error("Error fetching or updating users:", error);
    }
}

// Run check every 30 seconds
setInterval(checkAndAddExpiringUsers, 30000);
checkAndAddExpiringUsers();
