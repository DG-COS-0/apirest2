const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/usefulApiOp");

exports.deleteOneRessource = (Model) =>
  catchAsync(async (req, res, next) => {
    const ressource = await Model.findByIdAndDelete(req.params.id);

    if (!ressource) {
      return next(
        new AppError("Aucune ressource trouvé avec cet identifiant", 404)
      );
    }

    res.status(204).json({
      status: "succes",
      message: "ressource supprimé avec succès",
      data: null,
    });
  });

exports.updateOneRessource = (Model) =>
  catchAsync(async (req, res, next) => {
    const ressource = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!ressource) {
      return next(
        new AppError("Aucune ressource trouvé avec cet identifiant", 404)
      );
    }

    res.status(200).json({
      status: "succes",
      data: {
        data: ressource,
      },
    });
  });

exports.createOneRessource = (Model) =>
  catchAsync(async (req, res, next) => {
    const ressource = await Model.create(req.body);

    res.status(201).json({
      status: "succes",
      data: {
        data: ressource,
      },
    });
  });

exports.getOneRessource = (Model, populating) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populating) query = query.populate(populating);
    console.log(query);
    const ressource = await query;

    if (!ressource) {
      return next(
        new AppError("Aucune ressource trouvé avec cet identifiant", 404)
      );
    }

    res.status(200).json({
      status: "succes",
      data: {
        data: ressource,
      },
    });
  });

exports.getAllRessources = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const ressources = await features.query;

    res.status(200).json({
      status: "succes",
      results: ressources.length,
      data: {
        data: ressources,
      },
    });
  });
