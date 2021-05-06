let exportedMethods = {
    validateLogin(username, password){
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
        if (password.trim().length === 0)
        {
            throw 'Error: Password must not be empty.'
        }
    }
};

module.exports = exportedMethods;