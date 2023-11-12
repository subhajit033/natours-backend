const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");
dotenv.config({ path: `config.env` });

const DB = process.env.DATABASE_URI;
console.log("Database - " + DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful.."))
  .catch((err) => console.log(err.message));

//read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);

//IMPORT data into database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded...");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfully...");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
