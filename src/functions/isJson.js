function isJson(str) {
    try {
        JSON.parse(str);
    } catch (err) {
        return false;
    }
    return true;
};

module.exports = isJson;