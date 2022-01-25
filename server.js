const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI);

app.use(express.static(`${__dirname}/public`));

app.listen(port, console.log(`Server is listening at port ${port}.`));