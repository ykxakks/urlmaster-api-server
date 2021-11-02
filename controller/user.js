const express = require("express");
const UserSystem = require('../features/user/UserSystem');
const { setTestUsers } = require('../features/user/userFuncs');
const userRouter = express.Router();

const userSystem = new UserSystem();
setTestUsers(userSystem);

// GET http://localhost:8080/api/v1/user/{userId}
userRouter.get("/:userId", async (req, res) => {
    console.log("getting userId");
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
});

// POST http://localhost:8080/api/v1/user/{userID} -d {user-content-stringified-json}
userRouter.post("/:userId", async (req, res) => {
    const contentType = req.headers['content-type'];
    if (!contentType || contentType !== 'application/json') {
        res.status(400).send({error: "POST request for users must have content-type as application/json."});
    } else {
        const userId = req.params.userId;
        const content = req.body;
        const userResponse = await userSystem.dispatch({
            type: "POST",
            id: userId,
            user: content
        });
        if (userResponse.status === 'success') {
            res.send(userResponse.response);
        } else {
            console.log(userResponse);
            const status = userResponse.code || 500;
            res.status(status).send({ error: userResponse.msg });
        }
    }
});

// GET http://localhost:8080/api/v1/user/activate/{userId}?code={validationCode}
userRouter.get("/activate/:userId", async (req, res) => {
    console.log("query =", req.query);
    const code = req.query.code;
    if (!code) {
        res.status(400).send({ error: "No activation code provided."});
        return ;
    }
    const userId = req.params.userId;
    const userResponse = await userSystem.dispatch({
        type: "ACT",
        id: userId, 
        code: code
    });
    if (userResponse.status === 'success') {
        res.send(userResponse.response);
    } else {
        console.log(userResponse);
        const status = userResponse.code || 500;
        res.status(status).send({ error: userResponse.msg });
    }
    // res.send("Hello world!");
});

module.exports = userRouter;
