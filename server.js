const PORT = 3000
const express = require('express')
const app = express();
const path = require("path")
const bodyParser = require("body-parser")
const { connect_mongoDB,
   addSurveyResponse,
   getAllSurveyResponses,
   getSingleSurveyResponse,
   deleteSingleSurveyResponse } = require("./mongoDB_connection");

// middlewares
app.use(bodyParser.json())// parse incoming request bodies with JSON data and make them available under req.body property
app.use(bodyParser.urlencoded({ extended: true }))// parses incoming requests with URL-encoded payloads. It allows you to access the data from the request body under the req.body property
app.use(express.static('./public'))

connect_mongoDB().catch(err => console.error(err))//'sample_geospatial'

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, "/views/index.html"))
})
app.get('/surveyForm', (req, res) => {
   res.sendFile(path.join(__dirname, "/views/surveyForm.html"))
})
app.post('/survey_form', (req, res) => {
   console.log(req.body);
   addSurveyResponse(req.body).catch((err) => console.log("addSurveyResponse err: ", err));
   res.json({ msg: "Data received" });
})

app.get("/afterSurvey", (req, res) => {
   res.sendFile(path.join(__dirname, 'views/afterSurvey.html'))
})
app.get("/surveyOutcome", (req, res) => {
   res.sendFile(path.join(__dirname, `views/surveyOutcome.html`))
})
app.get("/allResponses", (req, res) => {
   console.log('inside all responses route');
   getAllSurveyResponses()
      .then((allResponses) => {
         res.json(allResponses.map((item) => item.ansArr))
      })
      .catch((err) => res.json({ msg: 'error occured at /allResponses', err }))
})

app.get('/singleUserdata', (req, res) => {
   res.sendFile(path.join(__dirname, "views/singleUserdata.html"))
})
app.get("/singleResponse", (req, res) => {
   console.log('inside single responses route', req.query);
   getSingleSurveyResponse(req.query)
      .then((result) => {
         if (result) res.json(result);
         else res.json({ msg: 'not found' });
      })
})
app.get('/deleteSingleData', (req, res) => {
   res.sendFile(path.join(__dirname, 'views/deleteSingleData.html'))
})
app.delete('/deleteSingleResponse', (req, res) => {
   console.log(req.body);
   deleteSingleSurveyResponse(req.body)
      .then((result) => {
         console.log(result);
         if (result.deletedCount)
            res.json({ delete: true, msg: "Delete Success" })
         else
            res.json({ delete: false, msg: "Email-id Not found" })
      })
      .catch((err) => { console.log(err); res.json({ delete: false, msg: "Delete Failure, Some error occured!" }) })
})



app.listen(PORT, (err) => {
   if (err) {
      console.log("some error", err);
      return;
   }
   console.log("server running on port ", PORT);
})

