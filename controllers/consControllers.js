const {
  getAllRessources,
  getOneRessource,
  createOneRessource,
  updateOneRessource,
  deleteOneRessource,
} = require("./raccourcis");
const Consultation = require("./../models/consModel");
const catchAsync = require("../utils/catchAsync");
exports.setUserId = catchAsync(async function (req, res, next) {
  if (!req.body.creator) {
    console.log(req.user);
    req.body.client = req.user.id;
  }
  next();
});

exports.getAllCons = getAllRessources(Consultation);
exports.getCon = getOneRessource(Consultation);

exports.createCon = createOneRessource(Consultation);
exports.updateCon = updateOneRessource(Consultation);
exports.deleteCon = deleteOneRessource(Consultation);
exports.uploadManyCon = catchAsync(async (req, res, next) => {
  
});
