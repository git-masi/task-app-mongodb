const express = require('express');
const chalk = require('chalk');

const app = express();

app.use('/', (req, res, next) => {
  res.send('<h1>It\'s alive!</h1>')
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (!err) {
    console.log('Server started:');
    console.log(chalk.blue(`http://127.0.0.1:${PORT}`));
  }
})