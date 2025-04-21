/*
    * Verifique se a string contém apenas dígitos.
*/
const stringContainsOnlyDigits = (string:string) => /^\d+$/.test(string);

export default stringContainsOnlyDigits;