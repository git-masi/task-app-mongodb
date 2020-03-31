const app = require('./app');
const chalk = require('chalk');

const port = process.env.PORT || 3000;;

app.listen(port, () => {
  console.log('Server running');
  console.log(chalk.blue(`http://127.0.0.1:${port}`));
})