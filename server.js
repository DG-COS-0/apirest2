const app = require("./app");
const port = process.env.EXPRESS_APP_PORT || 5001;
const mongoose = require("mongoose");

try {
  mongoose.connect(
    process.env.DATABASE_URI.replace(
      "<password>",
      process.env.DATABASE_PASSWORD
    )
  );
  console.log("Connexion a la base de donnée réussie");
} catch (err) {
  console.error("Oups. Une erreur s'est produite pendant la connexion a la DB");
}

app.listen(port, () => {
  console.log(`Votre application à démarré au http://localhost:${port}`);
});
