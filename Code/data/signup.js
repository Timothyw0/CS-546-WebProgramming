let exportedMethods = {
    validateEmail(email)
    {
        let containsSymbol = false;
        for (let i = 0; i < email.length && (containsSymbol === false); i++)
        {
            if (email[i] === '@')
            {
                containsSymbol = true;
            }
        }
        return containsSymbol;
    },
    hasOneNumber(password)
    {
        let hasNumber = false;
        for (let i = 0; i < password.length && (hasNumber === false); i++)
        {
            if (typeof password[i] === 'number')
            {
                hasNumber = true;
            }
        }
        return hasNumber;
    },
    validateSignUp(username, password, email, birthday){
        if (typeof username != 'string')
        {
            throw 'Error: Username must be a string!'
        }
        if (username.trim().length === 0)
        {
            throw 'Error: Username must not be empty'
        }
        if (typeof password != 'string')
        {
            throw 'Error: Password must be a string!'
        }
        if (password.trim().length < 8)
        {
            throw 'Error: Password must be 8 characters or more.'
        }
        if (password.toLowerCase() === password)
        {
            throw 'Error: There must be a capital letter in the password.'
        }
        if (this.hasOneNumber(password) === false)
        {
            throw 'Error: There must be one number in the password.'
        }
        if (typeof email != 'string')
        {
            throw 'Error: Email must be a string'
        }
        if (email.trim.length() === 0)
        {
            throw 'Error: Email must not be empty.'
        }
        if (this.validateEmail(email) === false)
        {
            throw 'Error: Invalid email format.'
        }
    },

};

module.exports = exportedMethods;