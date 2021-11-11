const express = require("express");
const CourseSystem = require('../features/course/CourseSystem');
const { setTestCourses } = require('../features/course/courseFuncs');
const courseRouter = express.Router();

const courseSystem = new CourseSystem();
setTestCourses(courseSystem);

// GET http://localhost:8080/api/v1/course/all
courseRouter.get("/all", async (req, res) => {
    const courseResponse = await courseSystem.dispatch({
        type: "ALL"
    });
    if (courseResponse.status === 'success') {
        res.json(courseResponse.response);
    } else {
        const status = courseResponse.code || 500;
        res.status(status).send({ error: courseResponse.msg });
    }
});

// GET http://localhost:8080/api/v1/course/{courseId}
courseRouter.get("/:courseId", async (req, res) => {
    const courseId = req.params.courseId;
    const courseResponse = await courseSystem.dispatch({
        type: "GET", 
        id: courseId
    });

    if (courseResponse.status === 'success') {
        res.json(courseResponse.response);
    } else {
        const status = courseResponse.code || 500;
        res.status(status).send({ error: courseResponse.msg });
    }
});

// POST http://localhost:8080/api/v1/course/{courseId} -d {course-content-stringified-json}
courseRouter.post("/:courseId", async (req, res) => {
    const contentType = req.headers['content-type'];
    if (!contentType || contentType !== 'application/json') {
        res.status(400).send({error: "POST request for courses must have content-type as application/json."});
    } else {
        const courseId = req.params.courseId;
        const content = req.body;
        const courseResponse = await courseSystem.dispatch({
            type: "POST",
            id: courseId,
            course: content
        });
        if (courseResponse.status === 'success') {
            res.send(courseResponse.response);
        } else {
            console.log(courseResponse);
            const status = courseResponse.code || 500;
            res.status(status).send({ error: courseResponse.msg });
        }
    }
});

// GET http://localhost:8080/api/v1/course/search?{query-string}
courseRouter.get('/search/query', async (req, res) => {
    // console.log(req.query);
    const day = req.query.day, period = req.query.period;
    const courseResponse = await courseSystem.dispatch({
        type: "FILTER", 
        day, period
    });
    if (courseResponse.status === 'success') {
        res.send(courseResponse.response);
    } else {
        console.log(courseResponse);
        const status = courseResponse.code || 500;
        res.status(status).send({ error: courseResponse.msg });
    }
});

module.exports = courseRouter;
