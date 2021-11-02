const express = require("express");
const router = require("./router");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const jsonHandler = require('./controller/jsonHandler');

const PORT = process.env["APP_PORT"] || 8080;
const HOST = process.env["APP_HOST"] || "localhost";

const main = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(jsonHandler);

    app.use(morgan("combined"));

    app.use("/api/v1", router);

    app.listen(PORT, HOST, () =>
        console.log(`Server listening on ${HOST}:${PORT}`)
    );
};

main();
