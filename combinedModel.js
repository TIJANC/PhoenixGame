const mongoose = require('mongoose');

const combinedSchema = new mongoose.Schema({
    userInfo: { type: String },
    scores: { type: Array }
});

const Combined = mongoose.model('Combined', combinedSchema);

module.exports = Combined;
