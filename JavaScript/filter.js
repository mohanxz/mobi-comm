function filterTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("user-table");
    let rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName("td");
        let rowText = "";
        let matchFound = false;

        // Loop through all cells in the row
        for (let j = 0; j < cells.length; j++) {
            let cellText = cells[j]?.textContent.toLowerCase();

            // Reset previous highlighting
            cells[j].innerHTML = cells[j].textContent;

            // Highlight matching part
            if (input && cellText.includes(input)) {
                let regex = new RegExp(`(${input})`, "gi");
                cells[j].innerHTML = cells[j].textContent.replace(regex, `<span class="highlight">$1</span>`);
                matchFound = true;
            }
            rowText += cellText + " ";
        }

        // Show row if match is found, hide otherwise
        rows[i].style.display = matchFound || input === "" ? "" : "none";
    }
}





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


function sortTable() {
    let sortBy = document.getElementById("sortSelect").value;
    let tableBody = document.getElementById("user-table"); // Table Body
    let rows = Array.from(tableBody.querySelectorAll("tr"));

    rows.sort((rowA, rowB) => {
        let nameA = rowA.cells[1].textContent.trim().toLowerCase(); // Username Column
        let nameB = rowB.cells[1].textContent.trim().toLowerCase();
        let daysA = parseInt(rowA.cells[6].textContent) || 0; // Days Left Column
        let daysB = parseInt(rowB.cells[6].textContent) || 0;

        if (sortBy === "name_asc") return nameA.localeCompare(nameB);
        if (sortBy === "name_desc") return nameB.localeCompare(nameA);
        if (sortBy === "daysLeft_asc") return daysA - daysB;
        if (sortBy === "daysLeft_desc") return daysB - daysA;
        if(sortBy==="reset")window.location.href="http://127.0.0.1:5501/AdminDashboard.html";
        return 0; // Default (No Sorting)
    });

    // Clear and re-append sorted rows
    tableBody.innerHTML = "";
    rows.forEach(row => tableBody.appendChild(row));
}
