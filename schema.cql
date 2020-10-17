CREATE KEYSPACE IF NOT EXISTS testqnas WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : '1'};

CREATE TABLE testqnas.questions (
  id INT,
  product_id INT,
  body TEXT,
  date_written DATE,
  asker_name VARCHAR,
  asker_email TEXT,
  reported INT,
  helpful INT,
  PRIMARY KEY (product_id, id)
) WITH CLUSTERING ORDER BY (id ASC);

CREATE TABLE testqnas.answers (
  id INT,
  question_id INT,
  body TEXT,
  date_written DATE,
  answerer_name VARCHAR,
  answerer_email VARCHAR,
  reported INT,
  helpful INT,
  PRIMARY KEY (question_id, id)
) WITH CLUSTERING ORDER BY (id ASC);

CREATE TABLE testqnas.answers_photos (
  id INT,
  answer_id INT,
  url VARCHAR,
  PRIMARY KEY (answer_id, id)
) WITH CLUSTERING ORDER BY (id ASC);