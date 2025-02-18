/*
    * Verifique se a string contém apenas dígitos.
*/
const stringContainsOnlyDigits = (string) => /^\d+$/.test(string);

module.exports = stringContainsOnlyDigits;