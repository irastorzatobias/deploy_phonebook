require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("build"));
app.use(morgan("tiny"));

app.get("/api/persons", (request, response) => {
  try {
    Person.find({}).then((person) => {
      response.json(person);
    });
  } catch (e) {
    response.status(500).send("Error retrieving persons");
  }
});

app.get("/info", (request, response) => {
  try {
    Person.countDocuments().then((count) => {
      response.send(`<p>Phonebook has info for ${count} people</p>`);
    });
  } catch (e) {
    response.status(500).send("Error retrieving person count");
  }
});

app.get("/api/persons/:id", (request, response) => {
  try {
    Person.findById(request.params.id).then((person) => {
      response.json(person);
    });
  } catch (e) {
    response.status(500).send("Error retrieving person");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  try {
    const { id } = request.params;
    Person.findByIdAndRemove(id).then(
      response.status(204).send("Person deleted")
    );
  } catch (e) {
    response.status(404).send(e.message);
  }
});

app.post("/api/persons", (request, response) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };

  const newPerson = new Person(person);

  Person.findOne({ name: person.name }).then((res) => {
    if (res) {
      Person.findOneAndUpdate(
        { name: person.name },
        { number: person.number },
        { new: true }
      );

      return response.status(204).send('updated')
    } else {
      newPerson.save().then((result) => {
        console.log("saved");
      });
      return response.status(204).send('saved')
    }
  });

});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findOneAndUpdate({name: person.name }, {number: person.number}, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
