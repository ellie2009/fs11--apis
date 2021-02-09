const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const data = require("./data/pokemon.js");
const e = require("express");

app.use(bodyParser.json());
//this prepares the response object
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.contentType("application/json");
  next();
});

app.get("/pokemon/:id/attacks", function(req, res) {
  console.log(req.params);
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    if (parseInt(data[i].id) === parseInt(req.params.id)) {
      return res.send(data[i].attacks);
    }
  }
  res.status(404).send("Pokemon does not exist");
});

app.get("/pokemon", function(req, res) {
  res.send(data);
});

app.get("/pokemon/:id", function(req, res) {
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i]);
    if (parseInt(data[i].id) === parseInt(req.params.id)) {
      return res.send(data[i]);
    }
  }
  res.status(404).send("Pokemon does not exist");

  /* ALTERNATIVE
  const pokemon = data.find(e => parseInt(e.id) === parseInt(req.params.id))
  if (!pokemon) {
    res.status(404).send('Pokemon does not exist');
  }
  res.send(pokemon);
  */
});

// adds a new Pokemon object to the data
app.post("/pokemon", function(req, res) {
  console.log(req.body);
  data.push(req.body);
  res.send(data);
});

app.get("/", function(req, res) {
  res.send("Hello world");
});

app.listen(3000);
console.log("Listening on port 3000...");

app.put("/pokemon/:id", function(req, res) {
  //could you use the app.get() method here?
  const index = getIndexOfID(data, req.params.id);

  if (index === -1) {
    res.status(404).send("Not found. Pokemon with this ID doesn't exist");
  } else {
    let newObj = { ...data[index] };

    for (let key in req.body) {
      if (newObj.hasOwnProperty(key)) {
        newObj[key] = req.body[key];
      } else {
        newObj = { ...newObj, [key]: req.body[key] };
      }
    }

    data[index] = newObj;

    res
      .status(200)
      .send(`Successfully updated pokemon with ID ${req.params.id}`);
  }
});

app.delete("/pokemon/:id", function(req, res) {
  const index = getIndexOfID(data, req.params.id);

  if (index === -1) {
    res.status(404).send("Not found. Pokemon with this ID doesn't exist");
  } else {
    data.splice(index, 1);
    res
      .status(200)
      .send(`Successfully deleted pokemon with ID ${req.params.id}`);
  }
});

function getIndexOfID(arr, value) {
  let index = -1;
  for (let i = 0; i < arr.length; i++) {
    if (+arr[i].id === +value) {
      index = i;
    }
  }
  return index;
}

// METHOD res.end()
// Ends the response process. Use to quickly end the response without any data. If you need to respond with data, instead use methods such as res.send() and res.json().

// this replaces the entire pokemon except the ID
// const newObj = {...req.params, ...req.body}
// data[index]=newObj;
// res.send(`Successfully updated pokemon with ID ${req.params.id}`)
// res.end();

// get index manually
// let index = -1;
// for (let i = 0; i < data.length; i++) {
//   if (+data[i].id === +req.params.id) {
//     index = i;
//   }
// }
