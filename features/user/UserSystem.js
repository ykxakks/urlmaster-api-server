const level = require('level');
const { createResponse, createError } = require('../response/response');
const { checkUser, combineUser } = require('./userFuncs');

const cannotHandleErrorMessage = "Cannot handle actions other than GET/POST/ACT.";
const notFoundHandleErrorMessage = "User id not found.";

const postUserSucceedMessage = "User has been successfully updated.";
const postUserFailMessage = "User has not been set correctly.";
const invalidUserInfoMessage = "User information is invalid: "
const invalidUserMessage = "User information is invalid.";
const activationSucceedMessage = "User has been successfully activated!";
const activationCodeErrorMessage = "Incorrect validation code.";
const activationInternalErrorMessage = "Fail to activate user account.";
const alreadyActivatedErrorMessage = "User account has already been activated.";

function UserSystem() {
    this.dbName = 'user';
    this.dbName = './leveldb/' + this.dbName;

    this.activationDBName = 'user-activation';
    this.activationDBName = './leveldb/' + this.activationDBName;

    this.db = level(this.dbName, { valueEncoding: 'json' });
    this.actDB = level(this.activationDBName, { valueEncoding: 'json' });

    this.getUser = async (userId) => {
        return this.db.get(userId).catch(() => {});
    }
    this.getUserActInfo = async (userId) => {
        return this.actDB.get(userId).catch(() => {});
    }
    this.setUser = async (userId, user) => {
        return this.db.put(userId, user);
    }
    this.setUserActInfo = async (userId, info) => {
        return this.actDB.put(userId, info);
    }
    this.activate = async (userId) => {
        const info = await this.getUserActInfo(userId);
        if (!info) {
            return { err: `user id ${userId} not found.`};
        }
        if (info.activated) {
            return { err: `user ${userId} has already been activated.`};
        }
        info.activated = true;
        const res = await this.setUserActInfo(userId, info);
        return res;
    }

    this.dispatch = async (action) => {
        switch (action.type) {
            case 'GET': {
                const user = await this.getUser(action.id);
                const info = await this.getUserActInfo(action.id);
                if (user && info) {
                    user.activated = info.activated; // return activation status also
                    return createResponse(user);
                } else {
                    return createError(notFoundHandleErrorMessage, 404);
                }
            }
            case 'POST': { 
                console.log(action);
                const user = action.user;
                const id = action.id;
                const existUser = await this.getUser(id);
                // console.log(existUser);
                const checkUserResult = checkUser(user, existUser);
                if (checkUserResult.ok) {
                    // console.log("OK!");
                    const { userActInfo, combinedUser } = combineUser(user, existUser);
                    // console.log(userActInfo, combinedUser);
                    const err = await this.setUser(id, combinedUser);
                    // if user not exist: then we have also actInfo to be added
                    const actErr = (!existUser) && (await this.setUserActInfo(id, userActInfo));
                    // TODO: we must set the two values simultaneously!
                    if (err || actErr) {
                        return createError(postUserFailMessage, 500);
                    }
                    return createResponse(postUserSucceedMessage);
                } else {
                    if (checkUserResult.error) {
                        return createError(invalidUserInfoMessage + checkUserResult.error, 400);
                    } else {
                        return createError(invalidUserMessage, 400);
                    }
                }
                break;
            }
            case 'ACT': {
                // trying to activate user account
                const id = action.id;
                const code = action.code;
                const actInfo = await this.getUserActInfo(id);
                console.log('act info =', actInfo);
                if (actInfo.activated) {
                    return createError(alreadyActivatedErrorMessage, 400);
                }
                if (actInfo.code === code) {
                    const err = await this.activate(id);
                    if (!err) {
                        return createResponse(activationSucceedMessage);
                    } else {
                        return createError(activationInternalErrorMessage, 500);
                    }
                } else {
                    return createError(activationCodeErrorMessage, 400);
                }
                break;
            }
            default: {
                return createError(cannotHandleErrorMessage, 400);
            }
        }
    }
}

module.exports = UserSystem;