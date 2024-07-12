// let check = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
// const data = await pool.query("CREATE TABLE users(id SERIAL PRIMARY KEY,name VARCHAR(255),email VARCHAR(255) UNIQUE,password VARCHAR(255),correctAttempt INT,wrongAttempt INT)");
// const data = await pool.query("TRUNCATE users RESTART IDENTITY");

CREATE DATABASE maths;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  correctAttempt INT,
  wrongAttempt INT
);

CREATE TABLE dmas_questions(
  id SERIAL PRIMARY KEY,
  operation VARCHAR(10),
  denominator1 INT,
  denominator2 INT,
  numerator1 INT,
  numerator2 INT
);