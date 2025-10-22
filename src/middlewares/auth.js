const adminAuth = (req, res, next) => {
  console.log("Admin Middleware is called");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    return res.status(401).send("Admin not authorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User Middleware is called");
  const token = "abc";
  const isAdminAuthorized = token === "abc";
  if (!isAdminAuthorized) {
    return res.status(401).send("User not authorized");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
