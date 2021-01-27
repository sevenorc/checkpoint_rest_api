const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

let userModel = require("./models/user");

const app = express();
app.use(express.json());

const PORT = 5000;

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("database connected"));

// let newUser = new userModel({
//   firstName: "Si Tarek",
//   lastName: "Rhouma",
//   email: "sitarekrhouma@gmail.com",
// });

// newUser.save((err, data) => {
//   err
//     ? console.error(err)
//     : console.log(`${newUser.firstName} successfully added to your data`);
// });

app.get("/api/users", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ msg: "data fetched", users });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/users/add", async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const newUser = new userModel({ firstName, lastName, email });
    const user = await newUser.save();
    res.json({ msg: "user added", user });
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndUpdate(
      { _id: id },
      { new: true },
      { $set: req.body }
    );
    res.json({ msg: "user updated", user });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete({ _id: id });
    res.json({ msg: "user deleted", user });
  } catch (error) {
    console.log(error);
  }
});
