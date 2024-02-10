const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Veuillez entrer votre prenom!"],
    },
    surName: {
      type: String,
      required: [true, "Veuillez entrer votre nom de famille"],
    },
    email: {
      type: String,
      required: [true, "Veuillez entrer votre mot de passe"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Votre email n'est pas valide"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["client", "employee", "admin"],
      default: "client",
    },
    password: {
      type: String,
      required: [true, "Veuillez entrer un mot de passe"],
      minlength: 10,
      select: false,
      validate: [
        validator.isStrongPassword,
        "Veuillez entrer un mot de passe avec au moins 1 caratere majuscule, 1 cr=aractere minuscule, un caractere spéciale, et un chiffre",
      ],
    },
    passwordConfirmation: {
      type: String,
      required: [true, "Veuillez confirmer votre mot de passe."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Les mots de passe de sont pas les memes",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.virtual("fullName").get(function () {
  return this.surName + " " + this.firstName;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 15);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 5000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
