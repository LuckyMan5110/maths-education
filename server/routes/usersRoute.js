const express = require("express");
const router = express.Router();
const pool = require("./../db");

// VALIDATE
router.post("/validate", async (req, res) => {
  try {
    const { type, email, password } = req.body;
    if (type !== "" && email !== "" && password !== "") {
      let check = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      let data = check.rows[0];
      if (data) {
        if (type === "admin") {
          if (data.name === type) {
            if (data.password === password) {
              res.json(data);
            } else {
              res.json({ message: "Incorrect Password" });
            }
          } else {
            res.json({ message: "No Account Found" });
          }
        } else {
          if (data.name !== "admin") {
            if (data.password === password) {
              res.json(data);
            } else {
              res.json({ message: "Incorrect Password" });
            }
          } else {
            res.json({ message: "No Account Found" });
          }
        }
      } else {
        res.json({ message: "No Account Found" });
      }
    } else {
      res.json({ message: "Please fill all fields" });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ message: err.message });
  }
});

// CREATE
router.post("/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name !== "" && email !== "" && password !== "") {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        let check = await pool.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
          [name, email, password]
        );
        res.json(check.rows[0]);
      } else {
        res.json({ message: "Invalid email" });
      }
    } else {
      res.json({ message: "Please fill all fields" });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ message: "Email already registered" });
  }
});

// READ
router.get("/read", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(data.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// UPDATE
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, type } = req.body;
    if (email !== "" && password !== "") {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ||
        (type === "admin" && parseInt(id) === 1)
      ) {
        let check = await pool.query(
          "UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *",
          [email, password, id]
        );
        res.json(check.rows[0]);
      } else {
        res.json({ message: "Invalid email" });
      }
    } else {
      res.json({ message: "Please fill all fields" });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ message: "Email already registered" });
  }
});

// UPDATE SCORE
router.put("/updateScore/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isCorrect } = req.body;
    const data = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    let user = data.rows[0];
    let wrongattempt = user.wrongattempt;
    let correctattempt = user.correctattempt;

    if (isCorrect) {
      if (correctattempt) {
        correctattempt += 1;
      } else {
        correctattempt = 1;
      }
    } else {
      if (wrongattempt) {
        wrongattempt += 1;
      } else {
        wrongattempt = 1;
      }
    }
    let check = await pool.query(
      "UPDATE users SET wrongattempt = $1, correctattempt = $2 WHERE id = $3 RETURNING *",
      [wrongattempt, correctattempt, id]
    );
    res.json(check.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.json({ message: "Email already registered" });
  }
});

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
