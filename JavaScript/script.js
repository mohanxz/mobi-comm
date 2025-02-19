// let productList=document.getElementById("productList")
// window.addEventListener('load',()=>{
//     fetch("https://fakestoreapi.com/products")
//     .then(response=>{
//         if(!response.ok){
//             return new Error("404 not found");
//         }
//         return response.json();
//     })
//     .then(productData=>{
//         productData.forEach(product=>{
//         let newProduct=`
//            <div class="col">
//                     <div class="card" style="width: 18rem;">
//                         <img src=${product.image} class="card-img-top img-fluid" alt="..."  style="width: 18rem;">
//                         <div class="card-body">
//                           <h5 class="card-title">${product.title}</h5>
//                           <p class="card-text">${[product.category]}</p>
//                           <p class="card-text"><span class=text-decoration-line-through>${product.price+400}</span>${product.price}</p>
//                           <a href="#" class="btn btn-primary">Buy</a>
//                         </div>
//                       </div>
//                 </div>`
//              productList.innerHTML+=newProduct;   
//         })
//     })

// })
// let mNo = document.getElementById("mobile");
// mNo.addEventListener('change',()=>{
//     console.log(mNo.value)
//     let mobileNumber = mNo.value;
//     let regex = /^[6-9]\d{9}$/; 
    
//     if (regex.test(mobileNumber)) {
//         window.location.href = "http://127.0.0.1:5500/index.html";
        
//     } else {
//         let toast = new bootstrap.Toast(document.getElementById("errorToast"));
//         toast.show();
//     }
// })

// var triggerTabList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tab"]'));
// triggerTabList.forEach(function (triggerEl) {
//   var tabTrigger = new bootstrap.Tab(triggerEl);
//   triggerEl.addEventListener('click', function (event) {
//     event.preventDefault();
//     tabTrigger.show();
//   });
// });
