const express = require("express");
const hello_router = require("./controller/hello");
const userRouter = require('./controller/user');
const courseRouter = require('./controller/course');

const router = express.Router();

router.use("/hello", hello_router);
router.use("/user", userRouter);
router.use("/course", courseRouter);

module.exports = router;
