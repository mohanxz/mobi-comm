const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const usersFilePath = path.join(__dirname, "../userDatabase.json");

app.use(express.json());

app.get("/users", (req, res) => {
    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading users:", err);
            return res.status(500).send("Error fetching users");
        }
        res.json(JSON.parse(data).users);
    });
});

app.post("/updateUsers", (req, res) => {
    fs.writeFile(usersFilePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).send("Failed to update users.");
        }
        res.send("Users updated successfully!");
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
