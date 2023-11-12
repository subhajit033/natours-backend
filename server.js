const dotenv = require('dotenv');
const mongoose = require('mongoose');
//console.log(x) => x is not defined
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DATABASE_URI;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Db connection successful'));
// .catch((err) => {
//   console.log('Db connection failed -> ' + err);
// });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
});
