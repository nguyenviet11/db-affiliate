const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Item = mongoose.model('List', itemSchema);

module.exports = Item;