/**
 * Helper method to return the first attribute of the error object from validateJs
 */
exports.firstError = function (errorObj) {

    var obj = errorObj.errors;
    var keys = Object.keys(obj);
    var firstKey = keys[0];
    var info = obj[firstKey];

    return info[0];
};

exports.serverError = function (response, error) {
    // TODO: log server errors to file.
    console.error('Error: ' + error);
    return response.status(500).json('Oops! Something went wrong. Please try again.');
};

exports.getTokenFromHeaders = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};