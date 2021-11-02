const jsonHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send("Error: invalid JSON.");
    }
    next();
}

module.exports = jsonHandler;