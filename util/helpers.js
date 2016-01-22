/**
 * Helper method to return the first attribute of the error object from validateJs
 */
exports.firstError = function (errorObj) {

    var obj = errorObj.errors;
    var keys = Object.keys(obj);
    var firstKey = keys[0];
    var info = obj[firstKey];

    return info[0];
}