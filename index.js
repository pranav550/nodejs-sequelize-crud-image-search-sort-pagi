const express = require("express");
const bodyParser = require("body-parser");
// const User = require("./models/user");
// const Contact = require("./models/contact");
require("./models");

var userCtrl = require("./controllers/UserController");
const app = express();

// parse application/json
app.use(bodyParser.json());

app.post("/addUser", userCtrl.upload, userCtrl.addUser);
app.get("/users", userCtrl.getUsers);
app.get("/users/:id", userCtrl.getUser);
app.delete("/users/:id", userCtrl.deleteUser);
app.put("/users/:id", userCtrl.updateUser);
app.get("/query", userCtrl.queryUser);
app.get("/whereAttributes", userCtrl.WhereAttributes);
app.get("/asAlias", userCtrl.asAlias);
app.get("/count", userCtrl.count);

// User.sync({ force: true });
// Contact.sync({ force: true });
//User.sync();
//User.drop()

app.listen(3000, () => {
  console.log("app will run on 3000");
});
