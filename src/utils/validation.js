const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not Valid!");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("first name should be 4-50 charecters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
};

const validateLoinData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
};

module.exports = {
  validateSignUpData,
  validateLoinData,
};
