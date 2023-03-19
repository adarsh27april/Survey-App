const surveyForm = document.getElementById('survey_form')

document.addEventListener('load', generateQuestionComponents())
function generateQuestionComponents() {
   for (let i = 0; i < questions.length; i++) {
      // i = question index
      let question = `
         <div class="card mx-auto my-3 p-3" style="width: 50%; border-radius: 20px">
            <div class="card-body">
               <h4 class="card-title">${questions[i].question}</h4>
               <div class="card-text pt-2 px-3">
                  ${questions[i].ops.map((op, opIndex) => getQuestion(op, i, opIndex)).join("")}
               </div>
               <br>
            </div>
         </div>
      `
      surveyForm.innerHTML += question;
   }

   // `<input type="submit" value="Submit">`
   // surveyForm.innerHTML += `<button class="btn" type="submit" value="Submit" >Submit</button>`
   surveyForm.innerHTML += `
   <div class="card mx-auto" style="max-width: fit-content;min-width: fit-content;">
   <button class="btn btn-outline-primary" id="submitSurveyBtn" type="submit" onClick='radioValues()'>Submit</button>
   </div>
   `
}
function getQuestion(op, i, opIndex) {
   // opIndex = option index
   return `
         <div class="form-check">
            <input class="form-check-input" name="q${i}" id="q${i}${opIndex}" type="radio" que-index="${i}" value="${opIndex}">
            <label class="form-check-label" for="q${i}"> ${op} </label>
         </div>
      `
}

function radioValues() {
   event.preventDefault()

   let PersonName = document.getElementById('PersonName').value
   console.log(PersonName);
   if (!PersonName) {
      alert("Please provide some name in the name field")
      return;
   }
   let emailInput = document.getElementById("email")
   if (!emailInput.value || (emailInput.value && !emailInput.checkValidity())) {
      emailInput.style.borderColor = '#dc3545'
      document.getElementById('errorEmailMsg').style.display = 'block'
      alert("Please provide a correct email in the email field")
      return;
   }

   const ans = new Array(questions.length); // by creating array is this manner it will make sure that the size of array remains fixed
   ans.fill(-1)// -1 denotes nothing selected
   let radios = document.getElementsByTagName('input')
   for (let i = 0; i < radios.length; i++) {
      if (radios[i].type == 'radio' && radios[i].checked) {
         let queIndex = Number(radios[i].getAttribute('que-index'))
         ans[queIndex] = Number(radios[i].value)
      }
   }

   fetch('/survey_form', {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: PersonName, email: emailInput.value, ansArr: ans })
   })
      .then((res) => {
         if (res.ok) {
            return res.json()
         }
         throw new Error("Some Network Error")
      })
      .then((res) => {
         console.log(res);
         const submitSurveyBtn = document.getElementById("submitSurveyBtn")
         submitSurveyBtn.innerHTML = "Data Received, Redirecting..."
         submitSurveyBtn.setAttribute('disabled', '')
         setTimeout(() => window.location = '/afterSurvey', 3000)
      })
      .catch((err) => { console.log('some error: ', err); })
      .finally(() => {
         console.log('inside finally block');
      })

   // setTimeout(() => window.location = '/', 5000);// to redirect after 5 sec
}
