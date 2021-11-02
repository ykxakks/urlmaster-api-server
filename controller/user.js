const express = require("express");
const UserSystem = require('../features/user/UserSystem');
const { setTestUsers } = require('../features/user/userFuncs');
const userRouter = express.Router();

const userSystem = new UserSystem();
setTestUsers(userSystem);

// userRouter.get("/", async (req, res) => {
//     console.log(req.query);
//     console.log(JSON.stringify(req.query));
//     console.log(req.query.x);
//     const hellos = await Hello.getAll();
//     res.json({ content: hellos.map((hello) => hello.toObject()) });
// });

userRouter.get("/:userId", async (req, res) => {
    // res.send(req.params);
    const userId = req.params.userId;
    const userResponse = await userSystem.dispatch({
        type: "GET", 
        id: userId
    });

    if (userResponse.status === 'success') {
        res.json(userResponse.response);
    } else {
        console.log(userResponse);
        const status = userResponse.code || 500;
        res.status(status).send({ error: userResponse.msg });
    }
    // console.log(userResponse);
    // res.send("Hello world!");
    // res.send(userId);
});

module.exports = userRouter;
