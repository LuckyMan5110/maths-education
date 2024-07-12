const express = require("express");
const router = express.Router();
const pool = require("./../db");

// CREATE
router.post("/create", async (req, res) => {
  try {
    const { operation, denominator1, denominator2, numerator1, numerator2 } =
      req.body;
    if (
      operation !== "" &&
      denominator1 !== "" &&
      denominator2 !== "" &&
      numerator1 !== "" &&
      numerator2 !== ""
    ) {
      if (
        denominator1 !== 0 &&
        denominator2 !== 0 &&
        numerator1 !== 0 &&
        numerator2 !== 0
      ) {
        let check = await pool.query(
          "INSERT INTO dmas_questions (operation, denominator1, denominator2, numerator1, numerator2) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [operation, denominator1, denominator2, numerator1, numerator2]
        );
        res.json(check.rows[0]);
      } else {
        res.json({ message: "Please provide non zero numbers" });
      }
    } else {
      res.json({ message: "Please fill all fields" });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ message: err.message });
  }
});

// READ
router.get("/read", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM dmas_questions ORDER by id DESC"
    );
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      "SELECT * FROM dmas_questions WHERE id = $1",
      [id]
    );
    res.json(data.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// UPDATE
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { operation, denominator1, denominator2, numerator1, numerator2 } =
      req.body;
    if (
      operation !== "" &&
      denominator1 !== "" &&
      denominator2 !== "" &&
      numerator1 !== "" &&
      numerator2 !== ""
    ) {
      if (
        denominator1 !== 0 &&
        denominator2 !== 0 &&
        numerator1 !== 0 &&
        numerator2 !== 0
      ) {
        let check = await pool.query(
          "UPDATE dmas_questions SET operation = $1, denominator1 = $2, denominator2 = $3, numerator1 = $4, numerator2 = $5 WHERE id = $6 RETURNING *",
          [operation, denominator1, denominator2, numerator1, numerator2, id]
        );
        res.json(check.rows[0]);
      } else {
        res.json({ message: "Please provide none zero numbers" });
      }
    } else {
      res.json({ message: "Please fill all fields" });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ message: err.message });
  }
});

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query("DELETE FROM dmas_questions WHERE id = $1", [
      id,
    ]);
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
