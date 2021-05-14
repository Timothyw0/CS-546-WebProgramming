//const emailValidator = require('email-validator');
(function ($) {
    console.log(5)
    let firstName = $("#firstNameSignUp");
    let lastName = $("#lastNameSignUp");
    let username = $("#usernameSignUp");
    let password = $("#passwordSignUp");
    let email = $("#emailSignUp");
    let dateOfBirth = $("#dateOfBirthSignUp");
    let signUpForm = $("#signup-form");
    let results = $("#results");
    let signUpButton = $("#submitSignUp")
    

    signUpForm.submit(function(event){
        //event.preventDefault();
        console.log('Test BK')
        let firstNameText = firstName.val();
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
        console.log(dateOfBirthText);
        let splitDate = dateOfBirthText.split('-');
        console.log(splitDate[1]);
        if (!splitDate[0] || !splitDate[1] || !splitDate[2])
        {
            results.append("<li>You must enter valid text in your birthdate bar!</li>");
        }
        console.log('Kingsbery')

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
          console.log('Billy')
          $.ajax(requestConfig).then(function (responseMessage) {});
            results.removeAttr("hidden");
            results.append(
              "<li>Signup successfully added! Cheers!</h3><p>Please wait to be redirected</li>"
            );
            setTimeout(() => {
              $(location).attr("href", "/feed");
            }, 2000);
          });
})(window.jQuery);
