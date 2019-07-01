const express = require("express");
const router = express.Router();
router.get("/socket-io", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});
module.exports = router;