const mongoose = require('mongoose');

const combinedSchema = new mongoose.Schema(
  {
    userInfo: {
      type: String,
      required: true,
    },
    scores: {
      type: [Number],
      default: '',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Combined', combinedSchema);
