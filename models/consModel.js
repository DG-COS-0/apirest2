const mongoose = require("mongoose");

const consultationSchema = mongoose.Schema({
  code: {
    type: String,
    required: [true, "La consultation doit avoir un code de consulation"],

    validate: {
      validator: function (val) {
        if (val.length !== 8) {
          return false;
        }
        const nameSplit = val.split("-");

        if (nameSplit.length !== 2 && nameSplit.at(0) && nameSplit.at(1)) {
          return false;
        }
        if (nameSplit.at(0) !== "CONS") {
          return false;
        }

        if (nameSplit.at(1).length !== 3 && isNaN(nameSplit.at(1))) {
          return false;
        }

        return true;
      },
      message:
        "Votre nom de consultation doit etre sous la forme de <CONS-NNN>; Ex: CONS-001",
    },
  },
  description: {
    type: String,
    required: [true, "La consultation doit avoir une description"],
    minLength: [200, "La description  doit faire au moins  200 caracteres"],
    maxLength: [500, "La description ne doit pas depasser 500 caracteres"],
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "La consultation doit etre pour d'un client"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  price: {
    type: Number,
    required: [true, "VOus devez spécifier le prix de votre consultation"],
    min: [5000, "Les consultations commencent à partir de 5000 FCFA"],
  },
  status: {
    type: String,
    enum: {
      values: ["confirmee", "enAttente", "rejetee"],
      message:
        "le status est invalide veuillez choisir entre rejetee enAttente confirmee",
    },
    default: "enAttente",
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});
consultationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "client",
    select: "photo fullName email",
  });
  next();
});
module.exports = mongoose.model("Consultation", consultationSchema);
