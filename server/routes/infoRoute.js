const express = require("express");
const router = express.Router();
const pool = require("./../db");

function random(min = -25, max = 25) {
  let T = Math.floor(Math.random() * (max - min + 1) + min);
  while (T === 0) {
    T = Math.floor(Math.random() * (max - min + 1) + min);
  }
  return T;
}

// YOUTUBE VIDEO LINKS
router.get("/videoLinks/dmas", async (req, res) => {
  try {
    let links = {
      addSubtract: "https://www.youtube.com/embed/5juto2ze8Lg",
      multiply: "https://www.youtube.com/embed/qmfXyR7Z6Lk",
      divide: "https://www.youtube.com/embed/4lkq3DgvmJo",
    };
    res.json(links);
  } catch (err) {
    console.error(err.message);
  }
});

// USER ATTEMPT
router.get("/attempt/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      "SELECT correctattempt, wrongattempt FROM users WHERE id = $1",
      [id]
    );
    res.json(data.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// TOTAL
router.get("/total", async (req, res) => {
  try {
    let arithmetic = await pool.query("SELECT count(*) FROM dmas_questions");
    let user = await pool.query("SELECT count(*) FROM users");
    let total = {
      users: user.rows[0].count,
      arithmetic: arithmetic.rows[0].count,
    };
    res.json(total);
  } catch (err) {
    console.error(err.message);
  }
});

// ARITHMETIC SHEET
router.get("/sheet/dmas/:type/:mode", async (req, res) => {
  try {
    const { type, mode } = req.params;
    let final = [];

    if (mode === "pre") {
      let data;
      if (type !== "all") {
        data = await pool.query(
          "SELECT * FROM dmas_questions WHERE operation = $1 ORDER by id DESC",
          [type]
        );
      } else {
        data = await pool.query(
          "SELECT * FROM dmas_questions ORDER by id DESC"
        );
      }
      final = data.rows;
    } else {
      let c = 0;
      while (c !== 20) {
        let operation = type;
        if (type === "all") {
          let choice = random(1, 4);
          operation =
            choice === 1
              ? "add"
              : choice === 2
              ? "subtract"
              : choice === 3
              ? "multiply"
              : choice === 4
              ? "divide"
              : "";
        }
        final.push({
          id: c,
          operation: operation,
          denominator1: random(),
          denominator2: random(),
          numerator1: random(),
          numerator2: random(),
        });
        c++;
      }
    }
    res.json(final);
  } catch (err) {
    console.error(err.message);
  }
});

// ARITHMETIC DRILL QUESTION
router.get("/drill/dmas/:type", async (req, res) => {
  try {
    const { type } = req.params;
    let operation = type;
    if (type === "all") {
      let choice = random(1, 4);
      operation =
        choice === 1
          ? "add"
          : choice === 2
          ? "subtract"
          : choice === 3
          ? "multiply"
          : choice === 4
          ? "divide"
          : "";
    }
    let send = {
      operation: operation,
      denominator1: random(),
      denominator2: random(),
      numerator1: random(),
      numerator2: random(),
    };
    res.json(send);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
