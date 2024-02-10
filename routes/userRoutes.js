const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  onlyAccessFor,
  logout,
} = require("../controllers/authController");
const {
  updateMe,
  deleteMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUserPhoto,
  getMe,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/signUp", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.use(protect);
router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUser);

router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);
router.use(onlyAccessFor);
router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
