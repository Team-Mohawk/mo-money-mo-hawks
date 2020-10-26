
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['162.203.169.116'], localDataCenter: 'datacenter1', keyspace: 'testqnas'});

var getQnAByProduct = function(id, callback) {
  client.execute('SELECT id, body, date_written, asker_name, helpful FROM testqnas.questions WHERE product_id=? AND reported<1 ALLOW FILTERING', [id], {prepare: true})
  .then((data) => {
    var result = {
      product_id: id,
      results:[]
    }
    var packet = data.rows.map((row) => {
      var question = {
        question_id: row.id,
        question_body: row.body,
        question_date: row.date_written,
        asker_name: row.asker_name,
        question_helpfulness: row.helpful,
        reported: 0,
        answers: {}
      };
      client.execute('SELECT id, body, date_written, answerer_name, helpful FROM testqnas.answers WHERE question_id=? AND reported<1 ALLOW FILTERING', [row.id], {prepare: true}).then((data) => { data.rows.forEach((row) => {
        var answer = {
          id: row.id,
          body: row.body,
          date: row.date_written,
          answerer_name: row.answerer_name,
          helpfulness: row.helpful,
          photos: []
        }
        client.execute('SELECT id, url FROM testqnas.answers_photos WHERE answer_id=?', [row.id], {prepare: true}).then((data) => {answer.photos = data.rows});
        question.answers[row.id] = answer;
      })
      })
    })
    result.results = packet;
    return result;
  })
  .then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(err);
  })
}

var getAnswersByQuestion = function (id, callback) {
  client.execute('SELECT id, body, date_written, answerer_name, helpful FROM testqnas.answers WHERE question_id=? AND reported<1 ALLOW FILTERING', [id], {prepare: true})
  .then((data) => {
    var result = {
      question: id,
      page: 0,
      count: data.rows.length,
      results: data.rows.map(async (row) => {
        var photos = await client.execute('SELECT id, url FROM testqnas.answers_photos WHERE answer_id=?', [row.id], {prepare: true});
        return {
          answer_id: row.id,
          body: row.body,
          date: row.date_written,
          answerer_name: row.answerer_name,
          helpfulness: helpful,
          photos: photos.rows;
        }
      })
    };
    return result;
  })
  .then((data) => {callback(null, data)});
  .catch((err) => {callback(err)});
}


var postNewQuestion = function (product_id, body, asker_name, asker_email, callback) {
  var date = new Date();
  var datea = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' date.getDate();
  client.execute('INSERT INTO testqnas.questions product_id, body, date_written, asker_name, asker_email, reported, helpful VALUES ? ? ? ? ? ? ?' [product_id, body, datea, asker_name, asker_email, 0, 0], {prepare: true});
  .then((data) => {callback(null, data)});
  .catch((err) => {callback(err)});
}

var postNewAnswer = function (question_id, body, answerer_name, answerer_email, callback) {
  var date = new Date();
  var datea = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' date.getDate();
  client.execute('INSERT INTO testqnas.answers question_id, body, date_written, answerer_name, answerer_email, reported, helpful VALUES ? ? ? ? ? ? ?', [question_id, body, datea, answerer_name, answerer_email, 0, 0], {prepare: true});
  .then((data) => {callback(null, data)});
  .catch((err) => {callback(err)});
}

var reportQuestion = function (id, callback) {
  client.execute('SELECT product_id FROM testqnas.questions WHERE id=? ALLOW FILTERING', [id], {prepare: true});
  .then((data) => {
    var product_id = data.rows[0].product_id;
    return {product_id: product_id}});
  .then((data) => {
    client.execute('UPDATE testqnas.questions SET reported=1 WHERE id=? AND product_id=?', [id, data.product_id], {prepare: true});
  })
  then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(err);
  })
}

var reportAnswer = function (id, callback) {
  client.execute('SELECT question_id FROM testqnas.answers WHERE id=? ALLOW FILTERING', [id], {prepare: true});
  .then((data) => {
    var question_id = data.rows[0].question_id;
    return {question_id: question_id}});
  .then((data) => {
    client.execute('UPDATE testqnas.answers SET reported=1 WHERE id=? AND product_id=?', [id, data.question_id], {prepare: true});
  })
  then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(err);
  })
}

var addQuestionHelpfulness = function (id, callback) {
  client.execute('SELECT helpful, product_id FROM testqnas.questions WHERE id=? ALLOW FILTERING', [id], {prepare: true});
  .then((data) => {
    var helpful = data.rows[0].helpful + 1;
    var product_id = data.rows[0].product_id;
    return ({helpful: helpful, product_id: product_id});
  })
  .then((data) => {
    client.execute('UPDATE testqnas.questions SET helpful=? WHERE product_id=? AND id=?', [res.helpful, res.product_id ,id], {prepare: true});
  })
  .then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(err);
  })
}

var addAnswerHelpfulness = function (id, callback) {
  client.execute('SELECT helpful, question_id FROM testqnas.answers WHERE id=? ALLOW FILTERING', [id], {prepare: true});
  .then((data) => {
    var helpful = data.rows[0].helpful + 1;
    var question_id = data.rows[0].question_id;
    return ({helpful: helpful, question_id: question_id});
  })
  .then((data) => {
    client.execute('UPDATE testqnas.answers SET helpful=? WHERE question_id=? AND id=?', [res.helpful, res.question_id ,id], {prepare: true});
  })
  .then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(err);
  })
}


module.exports = {
  getQnAByProduct,
  getAnswersByQuestion,
  postNewQuestion,
  postNewAnswer,
  reportQuestion,
  reportAnswer,
  addQuestionHelpfulness,
  addAnswerHelpfulness
};