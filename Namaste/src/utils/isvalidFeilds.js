const isvalidFeilds = (req) => {
  const validFeilds = ["about", "age", "photourl", "firstName", "lastName"];
  const isvalidFeilds = Object.keys(req.body).every((val) =>
    validFeilds.includes(val),
  );
  return isvalidFeilds;
};
module.exports = isvalidFeilds;
