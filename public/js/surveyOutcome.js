console.log('inside survey outcome js file');
const outcomeDiv = document.getElementById('outcome')
// let outcome;
async function getResponseArr() {
   fetch('/allResponses', { method: 'GET' })
      .then(res => res.json())
      .then((data) => {
         console.log(data)
         outcome = generateOutcomeReport(data);
         generateSurveyHTML(outcome)
      })
      .catch(err => console.error(err))
}

getResponseArr();

function generateSurveyHTML(outcome) {
   for (let i = 0; i < outcome.length; i++) {
      let response = `
      <div class="card mx-auto my-3 p-3" style="width: 50%; border-radius: 20px">
         <div class="card-body">
            <h4 class="card-title">${questions[i].question}</h4>
            <div class="card-text pt-2 px-3">
               <table class="table table-hover table-striped"><tbody>
                  ${questions[i].ops.map((options, index) => getOptionsFrequency(options, index, outcome[i][index], sumOfArr(outcome[i]))).join("")}
               </tbody></table>
            </div>
            <br>
         </div>
      </div>
   `
      outcomeDiv.innerHTML += response
   }
}
function getOptionsFrequency(option, index, frequency, sum) {
   let percent = (frequency === 0 && sum === 0) ? 'N/A' : `${Math.round(100 * frequency * 100 / sum) / 100}%`
   let freq = (frequency === 0 && sum === 0) ? 'N/A' : `${frequency}/${sum}`
   return `
      <tr>
         <td> ${option} </td> <td>${freq}</td> <td>${percent}</td>
      </tr>
   `
}
function sumOfArr(arr) {
   sum = 0;
   arr.forEach(item => {
      sum += item
   });
   return sum
}
function generateOutcomeReport(data) {
   let outcome = new Array(questions.length);// for every question what is the option choosen
   for (let i = 0; i < outcome.length; i++) {
      outcome[i] = new Array(questions[i].ops.length);// question i = {0: count0, 1: count1, 2:count2}
      outcome[i].fill(0);
   }
   /**
    [
      [op1_val , op2_val], <= question
      [],
      []
    ]
    */
   for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
         // j is index of question
         //data[i][j] => question [j] ke option ka index
         let optionIndex = data[i][j]
         if (optionIndex !== -1) {
            ++outcome[j][optionIndex]
         }
      }
   }
   console.log("outcome : ", outcome);
   return outcome
}
/*data arr
[3, 0, 0] <- data[i] has single person response containing index of option for every question
[3, 0, 0]
[0, 2, 1]
*/

