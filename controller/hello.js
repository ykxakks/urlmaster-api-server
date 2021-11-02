const express = require("express");
const Hello = require("../resource/hello");
const hello_router = express.Router();

Hello.create("42");

hello_router.get("/", async (req, res) => {
    // console.log(req);
    // console.log(req.url);
    // const params = new URLSearchParams(req.url);
    // console.log(params);
    // const urlParsed = new URL(req.url);
    // console.log(url.searchParams);
    console.log(req.query);
    console.log(JSON.stringify(req.query));
    console.log(req.query.x);
    const hellos = await Hello.getAll();
    res.json({ content: hellos.map((hello) => hello.toObject()) });
});

hello_router.get("/users/:userId", async (req, res) => {
    res.send(req.params);
});

module.exports = hello_router;
