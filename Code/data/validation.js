const emailValidator = require('email-validator');

function validString(string) {
    if(typeof string !== 'string' || !string) return false;

    return true;
}

function validEmail(email) {
    return emailValidator.validate(email);
}

