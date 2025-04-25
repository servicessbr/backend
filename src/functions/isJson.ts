function isJson(str:string | any) {
    try {
        JSON.parse(str);
    } catch (err) {
        return false;
    }
    return true;
};

export default isJson;