let tblBody=document.getElementById('tblBody');

window.addEventListener('load',()=>{
    fetch("http://localhost:3000/users")
    .then(response=>{
        if(!response){
            return new Error("User Data not found")
        }
        return response.json();
    })
    .then(usersList=>{
        usersList.forEach(user=>{
            let row=`
              <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.mobile}</td>
                    <td>${user.plan}</td>
                    <td>${user.validity}</td>
                    <td>${user.status}</td>
                </tr>
            `
            tblBody.innerHTML+=row;
        })
    })
    .catch(error=>{
tblBody.innerHTML=`
<tr><td>${error.message}</td></tr>
`
    })
})


    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".proceed-btn").forEach(button => {
            button.addEventListener("click", function () {
                const planTitle = this.closest(".plan-card").querySelector(".plan-title").textContent;
                const planPrice = this.closest(".plan-card").querySelector(".plan-price").textContent;

                window.location.href = `http://127.0.0.1:5500/payment.html?title=${encodeURIComponent(planTitle)}&price=${encodeURIComponent(planPrice)}`;
            });
        });
    });



