function createError(msg, code) {
    return {
        status: 'error', 
        msg: msg,
        code: code
    };
}
function createResponse(res) {
    return {
        status: 'success', 
        response: res
    };
}

exports.createError = createError;
exports.createResponse = createResponse;
