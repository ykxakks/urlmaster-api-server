function newUser({mail}) {
    const user = {};
    user.mail = mail;
    user.courses = [];
    user.alias = {};
    return user;
}

function newUserActInfo({code}) {
    const info = {};
    info.code = code;
    info.activated = false;
    return info;
}

// what is needed for a user?
// we should expect 

function checkUser(user, existUser) {
    // check whether the info in user/existUser can form a valid user
    // return { ok: (bool), error: (string) }
    // if not ok: return a message in error, or nothing so we will not return any detailed error message to user.

    if (!existUser) {
        // then user must contain "mail"
        const hasMail = user.hasOwnProperty("mail");
        if (!hasMail) {
            return { ok: false, error: "New user must be created with an email address."};
        }
        const hasCode = user.hasOwnProperty("code");
        if (!hasCode) {
            return { ok: false, error: "New user must be created with an activation code."};
        }
        return { ok: true };
    }

    // otherwise, we should allow user to have the following properties:
    // courses, alias
    // however, we do not care other properties
    return { ok: true };
}

function combineUser(user, existUser, actInfo) {
    // console.log(user, existUser);
    // usage: const { userActInfo, combinedUser } = combineUser(user, existUser);

    // combine the user info and exist user info to a new user info.
    if (!existUser) {
        const info = newUserActInfo({code: user.code});
        const resUser = newUser({mail: user.mail});
        // when creating a user, only mail and code will be recorded
        // other info must be added afterwards
        return { userActInfo: info, combinedUser: resUser };
    }
    // otherwise, we should combine the information to existUser
    const res = {...existUser};
    if (user.alias) {
        res.alias = {...user.alias};
    }
    if (user.courses) {
        res.courses = [...user.courses];
    }
    const result = {combinedUser: res};
    if (actInfo && user.hasOwnProperty('code')) {
        // update info
        console.log('updating info: ', actInfo, user);
        result.userActInfo = {
            ...actInfo,
        };
        result.userActInfo.code = user.code;
    };
    return result;
}

function setTestUsers(userSystem) {
    (async () => {
        let err = await userSystem.dispatch({
            type: "POST", 
            id: "123",
            user: {
                mail: "abc@gmail.com",
                code: "123456",
            }
        });
        console.log(err);

        err = await userSystem.dispatch({
            type: "POST", 
            id: "456",
            user: {
                mail: "def@gmail.com",
                code: "654321",
            }
        });
        console.log(err);

        err = await userSystem.dispatch({
            type: "GET",
            id: "123"
        });
        console.log(err);

        err = await userSystem.dispatch({
            type: "ACT",
            id: "123", 
            code: "123456",
        });
        console.log(err);

        err = await userSystem.dispatch({
            type: "GET",
            id: "123"
        });
        console.log(err);

        console.log("Test users appended!");
    })();
}

exports.checkUser = checkUser;
exports.combineUser = combineUser;
exports.setTestUsers = setTestUsers;