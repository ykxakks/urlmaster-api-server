function newCourse({name}) {
    const course = {};
    course.name = name;
    course.info = {};
    course.urls = {};
    course.defaultURL = null;
    return course;
}

function newCourseFilterInfo({period, day}) {
    const info = {};
    info.day = day;
    info.period = period;
    return info;
}

function checkCourse(course, existCourse) {
    // return { ok: (bool), error: (string) }

    if (!existCourse) {
        // then course must contain "name"
        const hasName = course.hasOwnProperty("name");
        if (!hasName) {
            return {
                ok: false,
                error: "New course must have a name."
            };
        }
        return { ok: true };
    }

    // otherwise, we should allow course to have the following properties:
    // name, info, urls, defaultURL, day, period
    // however, we do not care other properties
    return { ok: true };
}

function combineCourse(course, existCourse, existInfo) {
    if (!existCourse) {
        const info = {};
        const resCourse = newCourse({name: course.name});
        return { filterInfo: info, combinedCourse: resCourse };
    }
    const resCourse = {...existCourse};
    const resInfo = {...existInfo};

    if (course.name) {
        resCourse.name = course.name;
    }
    if (course.info) {
        resCourse.info = {...course.info};
    }
    if (course.urls) {
        resCourse.urls = {...course.urls};
    }
    if (course.defaultURL) {
        resCourse.defaultURL = course.defaultURL;
    }

    if (course.day) {
        resInfo.day = course.day;
    }
    if (course.period) {
        resInfo.period = course.period;
    }

    return { filterInfo: resInfo, combinedCourse: resCourse };
}

function setTestCourses(courseSystem) {
    (async () => {
        let err = await courseSystem.dispatch({
            type: "POST", 
            id: "123",
            course: {
                name: "c++"
            }
        });
        console.log(err);

        err = await courseSystem.dispatch({
            type: "POST", 
            id: "456",
            course: {
                name: "java"
            }
        });
        console.log(err);

        err = await courseSystem.dispatch({
            type: "GET",
            id: "123"
        });
        console.log(err);

        err = await courseSystem.dispatch({
            type: "POST",
            id: "123",
            course: {
                day: "Mon",
                period: "1",
                info: {
                    comment: "very good"
                },
                irrelative: "nothing"
            }
        });
        console.log(err);

        err = await courseSystem.dispatch({
            type: "FILTER",
            day: "Mon",
            period: "1"
        });
        console.log(err);
        
        console.log("Test courses appended!");
    })();
}

exports.checkCourse = checkCourse;
exports.combineCourse = combineCourse;
exports.setTestCourses = setTestCourses;