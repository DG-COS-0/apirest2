const express = require("express");
const {
  getAllCons,
  createCon,
  getCon,
  updateCon,
  deleteCon,
  setUserId,
} = require("../controllers/consControllers");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllCons).post(protect, setUserId, createCon);
router.use(protect);
router.route("/:id").get(getCon).patch(updateCon).delete(deleteCon);

module.exports = router;
