const express = require("express");
const hello_router = require("./controller/hello");
const userRouter = require('./controller/user');

const router = express.Router();

router.use("/hello", hello_router);
router.use("/user", userRouter);

module.exports = router;
