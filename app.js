const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const phonebookRouter = require("./controllers/phonebookController");

mongoose.set("strictQuery", false);

const url = config.MONGODB_URI;

console.log("connecting to", url);

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/persons', phonebookRouter);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app