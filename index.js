require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.APP_PORT || 3000;
const {router} = require("./routes/routers");
const exphbs = require('express-handlebars');
const server  = require('http').createServer(app);

app.use(express.json());
app.use(
  express.urlencoded({
      extended: true,
  })
);

app.use(express.static('public'));

// Templating Engine
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use("/api/v1", router);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });

});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})