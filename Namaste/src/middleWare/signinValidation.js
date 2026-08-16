var validator = require('validator');

const signinValidation = (rq) => {
  const { firstName, lastName, emailID, password } = rq.body;
  if (!firstName || !lastName) throw new Error("feilds are empty..!");
  else if (!validator.isEmail(emailID)) throw new Error("email is invalid");
  else if (!validator.isStrongPassword(password))
    throw new Error("password is not strong enough.!");
};
module.exports = { signinValidation };
