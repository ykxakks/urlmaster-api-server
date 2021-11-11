const level = require('level');
const { createResponse, createError } = require('../response/response');
const { checkCourse, combineCourse } = require('./courseFuncs');

const cannotHandleErrorMessage = "CourseSystem cannot handle actions other than GET/POST/FILTER.";
const notFoundHandleErrorMessage = "Course id not found.";

const postCourseSucceedMessage = "Course has been successfully updated.";
const postCourseFailMessage = "Course has not been set correctly.";
const invalidCourseInfoMessage = "Course information is invalid: "
const invalidCourseMessage = "Course information is invalid.";

function CourseSystem() {
    this.dbName = 'course';
    this.dbName = './leveldb/' + this.dbName;

    this.filterInfoDBName = 'course-filterInfo';
    this.filterInfoDBName = './leveldb/' + this.filterInfoDBName;

    this.db = level(this.dbName, { valueEncoding: 'json' });
    this.filterDB = level(this.filterInfoDBName, { valueEncoding: 'json' });

    this.getCourse = async (courseId) => {
        return this.db.get(courseId).catch(() => {});
    }
    this.getCourseFilterInfo = async (courseId) => {
        return this.filterDB.get(courseId).catch(() => {});
    }
    this.setCourse = async (courseId, course) => {
        return this.db.put(courseId, course);
    }
    this.setCourseFilterInfo = async (courseId, info) => {
        return this.filterDB.put(courseId, info);
    }
    this.getFilteredCourses = async ({day, period}) => {
        const courseArray = [];
        const filter = (info) => {
            return (!day || info.day === day) && (!period || info.period === period);
        }
        return new Promise((resolve, reject) => {
            this.filterDB.createReadStream()
            .on('data', (data) => {
                if (filter(data.value)) {
                    courseArray.push(data.key);
                }
            })
            .on('error', err => {
                reject(err);
            })
            .on('close', () => {
                resolve(courseArray);
            });
        });
    }
    this.getCourseList = async () => {
        const courseArray = [];
        return new Promise((resolve, reject) => {
            this.filterDB.createReadStream()
            .on('data', (data) => {
                courseArray.push(data.key);
            })
            .on('error', err => {
                reject(err);
            })
            .on('close', () => {
                resolve(courseArray);
            });
        });
    }

    this.dispatch = async (action) => {
        switch (action.type) {
            case 'GET': {
                const course = await this.getCourse(action.id);
                const info = await this.getCourseFilterInfo(action.id);
                if (course && info) {
                    const response = {
                        ...course, 
                        info: {
                            ...course.info,
                            ...info
                        }
                    };
                    // day, period, ... are saved in info
                    return createResponse(response);
                } else {
                    return createError(notFoundHandleErrorMessage, 404);
                }
            }
            case 'POST': { 
                const course = action.course;
                const id = action.id;
                const existCourse = await this.getCourse(id);
                const checkCourseResult = checkCourse(course, existCourse);
                if (checkCourseResult.ok) {
                    const existInfo = await this.getCourseFilterInfo(id);
                    const { filterInfo, combinedCourse } = combineCourse(course, existCourse, existInfo);
                    const err = await this.setCourse(id, combinedCourse);
                    const infoErr = await this.setCourseFilterInfo(id, filterInfo);
                    // TODO: we must set the two values simultaneously!
                    if (err || infoErr) {
                        return createError(postCourseFailMessage, 500);
                    }
                    return createResponse(postCourseSucceedMessage);
                } else {
                    if (checkCourseResult.error) {
                        return createError(invalidCourseInfoMessage + checkCourseResult.error, 400);
                    } else {
                        return createError(invalidCourseMessage, 400);
                    }
                }
                break;
            }
            case 'FILTER': {
                // trying to filter by filters
                // return an array of {id: <id>, name: <name>}
                const day = action.day;
                const period = action.period;

                const courseIds = await this.getFilteredCourses({day, period});
                const courses = await Promise.all(courseIds.map(async (id) => {
                    const course = await this.getCourse(id);
                    return {code: id, name: course.name};
                }));

                return createResponse(courses);

                // we need to load all data from this.filterDB
                // maybe a better idea is to use SQL?
            }
            case 'ALL': {
                const courseIds = await this.getCourseList();
                const courses = await Promise.all(courseIds.map(async (id) => {
                    const course = await this.getCourse(id);
                    return {code: id, name: course.name};
                }));

                return createResponse(courses);
            }
            default: {
                return createError(cannotHandleErrorMessage, 400);
            }
        }
    }
}

module.exports = CourseSystem;