const phonebookRouter = require("express").Router();
const Person = require("../models/person");

phonebookRouter.get("/", (request, response) => {
    try {
        Person.find({}).then((person) => {
            response.json(person);
        });
    } catch (e) {
        response.status(500).send("Error retrieving persons");
    }
});

phonebookRouter.get("/info", (request, response) => {
    try {
        Person.countDocuments().then((count) => {
            response.send(`<p>Phonebook has info for ${count} people</p>`);
        });
    } catch (e) {
        response.status(500).send("Error retrieving person count");
    }
});

phonebookRouter.get("/:id", (request, response) => {
    try {
        Person.findById(request.params.id).then((person) => {
            response.json(person);
        });
    } catch (e) {
        response.status(500).send("Error retrieving person");
    }
});

phonebookRouter.delete("/:id", (request, response, next) => {
    try {
        const { id } = request.params;
        Person.findByIdAndRemove(id).then(
            response.status(204).send("Person deleted")
        );
    } catch (e) {
        response.status(404).send(e.message);
    }
});

phonebookRouter.post("/", async (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number,
    };

    const newPerson = new Person(person);

    try {
        const existingPerson = await Person.findOne({ name: person.name });

        if (existingPerson) {
            const updatedPerson = await Person.findOneAndUpdate(
                { name: person.name },
                { number: person.number },
                { new: true }
            );

            console.log("updated");
            response.json(updatedPerson);
        } else {
            const savedPerson = await newPerson.save();
            console.log("saved");
            response.json(savedPerson);
        }
    } catch (e) {
        response.status(404).send("error validating");
    }
});

phonebookRouter.put("/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findOneAndUpdate(
        { name: person.name },
        { number: person.number },
        { new: true }
    )
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

module.exports = phonebookRouter;
