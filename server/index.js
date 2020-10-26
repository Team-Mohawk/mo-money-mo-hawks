const express = require('express');
const app = express();
const PORT = 1337;
const query = require('./queries')

app.get('/qa/questions', (req, res) => {
  query.getQnAByProduct(req.params.product_id, (err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  query.getAnswersByQuestion(req.params.question_id, (err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(200).send(data);
    }
})

app.post('/qa/questions', (req, res) => {
  query.postNewQuestion(req.params.product_id, req.params.body, req.params.name, req.params.email, (err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(201).send();
    }
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  query.postNewAnswer(req.params.question_id, req.params.body, req.params.name, req.params.email, req.params.photos,(err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(201).send();
    }
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  query.addQuestionHelpfulness(req.params.question_id, (err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(204).send();
    }
})

app.put('/qa/questions/:answer_id/helpful', (req, res) => {
  query.addAnswerHelpfulness(req.params.answer_id, (err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(204).send();
    }
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  query.reportQuestion(req.params.question_id, (err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(204).send();
    }
})

app.put('/qa/questions/:answer_id/report', (req, res) => {
  query.reportQuestion(req.params.answer_id, (err, data) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(204).send();
    }
})

app.listen(PORT, () => {
  console.log(`would it be okay if the app listened on port ${PORT} ?`);
});
