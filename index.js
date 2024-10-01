const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Item = require("./model/Item");

const app = express();
const ports = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/status", async (req, res) => {
  const { id } = req.query; 
  try {
    const item = await Item.findOne({ id: 3 }); 
    if (!item) {
      return res.status(404).json({ message: "No item found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item" });
  }
});

app.post("/api/update-status", async (req, res) => {
  const {id, status } = req.body;
  try {
    const item = await Item.findOne({id: id});
    if (!item) {
      return res.status(404).json({ message: "No item found" });
    }
    item.status = status;
    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
});

app.post("/api/create-item", async (req, res) => {
  try {
    // const existingItem = await Item.findOne();
    // if (existingItem) {
    //   return res.status(400).json({ message: 'Item already exists' });
    // }
    const newItem = new Item({
      id: 4,
      name: "roboforex-link2",
      status: false,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating item" });
  }
});

mongoose
  .connect(
    "mongodb+srv://nguyenvanvietbn1998:uAwOBI7DOuEFrbwv@ospreyfx.wt6cx.mongodb.net/?retryWrites=true&w=majority&appName=ospreyfx"
  )
  .then((result) => {
    console.log("connectd");
    app.listen(ports);
  })
  .catch((err) => {
    console.log(err, 'errrr');
  });
