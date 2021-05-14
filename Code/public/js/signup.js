//const emailValidator = require('email-validator');
(function ($) {
    let firstName = $("#firstNameSignUp");
    let lastName = $("#lastNameSignUp");
    let username = $("#usernameSignUp");
    let password = $("#passwordSignUp");
    let email = $("#emailSignUp");
    let dateOfBirth = $("#dateOfBirthSignUp");
    let signUpForm = $("#signup-form");
    let results = $("#errors-signups");
    let signUpButton = $("#submitSignUp")
    

    signUpForm.submit(function(event){
        event.preventDefault();
        let firstNameText = firstName.val();
        console.log(firstNameText)
        if (typeof firstNameText !== 'string' || firstNameText.trim().length === 0)
        {
            results.append("<li>You must enter text in your firstName bar!</li>");
        }
        
        //firstName.focus();
        let lastNameText = lastName.val();
        if (typeof lastNameText !== 'string' || lastNameText.trim().length === 0)
        {
            results.append("<li>You must enter text in your lastName bar!</li>");
        }
        let usernameText = username.val();
        if (typeof usernameText !== 'string' || usernameText.trim().length === 0)
        {
            results.append("<li>You must enter text in your username bar!</li>");
        }
        let passwordText = password.val();
        if (typeof passwordText !== 'string' || passwordText.trim().length === 0)
        {
            results.append("<li>You must enter text in your password bar!</li>");
        }
        let emailText = email.val();
        let validEmail = false;
        for (let i = 0; i < emailText.length && (validEmail === false); i++)
        {
            if (emailText[i] === '@')
            {
                validEmail = true;
            }
        }
        if (!validEmail || typeof emailText != 'string' || emailText.trim().length === 0)
        {
            results.append("<li>You must enter text in your e-mail bar!</li>");
        }
        let dateOfBirthText = dateOfBirth.val();
        let splitDate = dateOfBirthText.split('-');
        console.log(splitDate[1]);
        if (!splitDate[0] || !splitDate[1] || !splitDate[2])
        {
            results.append("<li>You must enter valid text in your birthdate bar!</li>");
        }

        //signUpButton.click();
        let requestConfig = {
            method: "POST",
            url: "/signup",
            contentType: "application/json",
            async: false,
            data: JSON.stringify({
              firstName: firstNameText,
              lastName: lastNameText,
              username: usernameText,
              password: passwordText,
              email: emailText,
              dateOfBirth: dateOfBirthText
            }),
          };
          $.ajax(requestConfig).then(function (responseMessage) {
            results.removeAttr("hidden");
            results.append(
              "<li>Post successfully added! Cheers!</h3><p>Please wait to be redirected</li>"
            );
            setTimeout(() => {
              $(location).attr("href", "/feed");
            }, 2000);
          });
    });

    /*
    function validateEmail(email)
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
    }
    function hasOneNumber(password)
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
    }
    function validateSignUp(username, password, email, birthday){
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
    }

*/
})(window.jQuery);