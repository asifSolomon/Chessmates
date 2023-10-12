// valid email
const validEmail = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;

// Minimum eight characters, at least one letter, one number and one special character:
const validPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// Starting character is in the lowercase or uppercase alphabet.
// Then 5-29 characters of word items.
const validUsername = /^[A-Za-z]\w{5,29}$/;

const validate = (username, email, password, confirmPassword) => {
    return {
        VemailErr: !validEmail.test(email), VusernameErr: !validUsername.test(username),
        VpasswordErr: !validPassword.test(password),
        VconfirmPasswordErr: password.localeCompare(confirmPassword) !== 0
    };
};

export const validateUser = (user) => {
    return validUsername.test(user);
}

export const validateEmail = (email) => {
    return validEmail.test(email);
}

export const validatePassword = (password) => {
    return validPassword.test(password);
}

export default validate;

