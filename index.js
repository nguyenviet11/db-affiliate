const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Item = require("./model/Item");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/status", async (req, res) => {
  const { id } = req.query;
  try {
    const item = await Item.findOne({ id: id });
    if (!item) {
      return res.status(404).json({ message: "No item found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item" });
  }
});

app.post("/api/update-status", async (req, res) => {
  const { id, status } = req.body;
  try {
    const item = await Item.findOne({ id: id });
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
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
function handleDisconnect() {
  reconnectAttempts++;
  if (reconnectAttempts < maxReconnectAttempts) {
    setTimeout(() => {
      mongoose
        .connect(process.env.MONGODB_URL, {
          maxPoolSize: 10,
          socketTimeoutMS: 45000,
        })
        .then(() => {
          console.log("Kết nối lại thành công!");
          reconnectAttempts = 0;
        })
        .catch((err) => {
          console.log("Lỗi khi thử kết nối lại:", err.message);
        });
    }, 5000);
  } else {
    console.log(
      `Đã đạt giới hạn thử kết nối lại (${maxReconnectAttempts}). Dừng kết nối...`
    );
  }
}

mongoose.connection.on("disconnected", handleDisconnect);

mongoose
  .connect(process.env.MONGODB_URL, {
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
  })
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err, "errrr");
  });
