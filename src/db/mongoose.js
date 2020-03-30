// ==================
// DO NOT DELETE THIS
require('dotenv').config();
// ==================

const mongoose = require('mongoose');

const connectionURL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-iagm9.mongodb.net/${process.env.DB_DATABASENAME}?retryWrites=true`;

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});