require("dotenv").config();
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create a person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});
const Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  var person = new Person({
    name: "John",
    age: 23,
    favoriteFoods: ["pizza", "pasta"],
  });
  person.save(function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// create an array of people by using create() method
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

/**
 * findEditThenSave is a pipeline:
 * Env --personId--> [findById] --person--> [save] --updatedPerson--> [done] --> Env
 * @param {Number} personId
 * @param {Function} done a callback function that is called after the current function has finished
 */
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  // Parameters of callback function are (err, data) => {}:
  //    err represents any error that occurred during the previous operation.
  //    data represents the data returned from the previous operation.
  Person.findById({ _id: personId }, (err, person) => {
    if (err) return console.log(err);

    person.favoriteFoods.push(foodToAdd);

    person.save((err, updatedPerson) => {
      if (err) return console.log(err);
      done(null, updatedPerson);
    });
  });
};

/**
 *
 * @param {String} personName
 * @param {Function} done
 */
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  // findOneAndUpdate() has a callback function parameter that takes 2 parameters: err and updatedDoc
  // err represents any error that occurred during the previous operation.
  // updatedDoc is the document that was updated
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (err, updatedDoc) => {
      if (err) return console.log(err);
      done(null, updatedDoc);
    }
  );
};

var removeById = function (personId, done) {
  // removedDoc is a json that contains the info of the removed person
  Person.findByIdAndRemove(personId, (err, removedDoc) => {
    if (err) return console.log(err);
    done(null, removedDoc);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  // outcome is a json object that contains the number of documents that were removed
  Person.remove({ name: nameToRemove }, (err, outcome) => {
    if (err) return console.log(err);
    done(null, outcome);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, data) => {
      if (err) return console.log(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
