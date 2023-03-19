const singleResponseDiv = document.getElementById('singleResponse')

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

   fetch(`/singleResponse?email=${emailInput.value}`)
      .then((res) => res.json())
      .then((data) => {
         console.log(data);
         generateHTML(data);
      })
}

function generateHTML(data) {
   singleResponseDiv.innerHTML = ''
   if (data.msg) {
      singleResponseDiv.innerHTML = `
      <div class="card mx-auto my-3 p-3" style="width: 50%; border-radius: 20px">
      No email id found, Please type correct email id
      </div>
      `
      return;
   }

   let { ansArr } = data;
   for (let i = 0; i < questions.length; i++) {
      console.log(ansArr[i]);
      let answer = (ansArr[i] == -1 || !ansArr[i]) ? '<code>Not Answered</code>' : questions[i].ops[ansArr[i]]
      let response = `
   <div class="card mx-auto my-3 p-3" style="width: 50%; border-radius: 20px">
      <div class="card-body" >
         <h4 class="card-title">${questions[i].question}</h4>
         <div class="card-text pt-2 px-3">
            <div class="card-text pt-2 px-3 d-flex justify-content-end">
               ${answer}
            </div>
         </div>
      </div>
   </div>
      `
      singleResponseDiv.innerHTML += response
   }
}