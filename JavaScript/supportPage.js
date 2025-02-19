//faq js
document.addEventListener("DOMContentLoaded", function () {
  const firstFaq = document.querySelector(".c-faq");
  if (firstFaq) {
      firstFaq.classList.add("c-faq--active");
  }

  document.body.addEventListener("click", function (event) {
      if (event.target.closest(".c-faq")) {
          document.querySelectorAll(".c-faq").forEach(faq => faq.classList.remove("c-faq--active"));
          event.target.closest(".c-faq").classList.add("c-faq--active");
      }
  });
});

//track order modal
  function validateOrderID() {
    let orderIDInput = document.getElementById("orderIDInput");
    let orderIDError = document.getElementById("orderIDError");
    let orderID = orderIDInput.value.trim();

    if (!/^\d{6}$/.test(orderID)) {
        orderIDError.innerText = "Please enter a valid 6-digit Order ID!";
        console.log(orderID)
        orderIDError.style.display = "block"; 
        return;
    } else {
        orderIDError.style.display = "none"; 
      }
      
    let orderIDModalEl = document.getElementById('orderIDModal');
    let orderIDModal = bootstrap.Modal.getInstance(orderIDModalEl);
    let awbNumber=document.getElementById("awbNumber");
    if (!orderIDModal) {
        orderIDModal = new bootstrap.Modal(orderIDModalEl);
        awbNumber.innerHTML=orderID;

    }
    orderIDModal.hide();

    let orderStatusModal = new bootstrap.Modal(document.getElementById('orderStatusModal'));
    orderStatusModal.show();
}