const afterDeleteResponseDiv = document.getElementById('afterDeleteResponse')

function getSingleResponse() {
   event.preventDefault();
   let emailInput = document.getElementById("email")
   if (!emailInput.value || (emailInput.value && !emailInput.checkValidity())) {
      emailInput.style.borderColor = '#dc3545'
      document.getElementById('errorEmailMsg').style.display = 'block'
      alert("Please provide a correct email in the email field")
      return;
   }
   console.log(emailInput.value);
   email = emailInput.value
   fetch(`/deleteSingleResponse`,
      {
         method: "DELETE",
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ email })
      })
      .then((res) => res.json())
      .then((data) => {
         console.log(data);
         generateHTML(data);
      })
}

function generateHTML(data) {
   if (data.delete) {
      afterDeleteResponseDiv.innerHTML = `
      <div class="card mx-auto my-3 p-3" style="width: 50%; border-radius: 20px">
         <h4 class="card-title">Delete Success</h4>
         <div class="card-text pt-2 px-3">
            The Survey Data related to the requested email id has been deleted
         </div>
      </div>
      `
   } else {
      afterDeleteResponseDiv.innerHTML = `
      <div class="card mx-auto my-3 p-3" style="width: 50%; border-radius: 20px">
         <h4 class="card-title mx-auto">Delete Failure</h4>
         <div class="card-text pt-2 px-3 mx-auto">
            ${data.msg}
         </div>
      </div>
      `
   }


}