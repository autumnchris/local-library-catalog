const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');

const app = express();
const port = process.env.PORT || 3000;

app.use(expressLayouts);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static(`${__dirname}/public`));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);

app.use((req, res, next) => {
    res.status(404).render('404', {page: 'Page not found'});
});

app.listen(port, console.log(`Server is listening at port ${port}.`));