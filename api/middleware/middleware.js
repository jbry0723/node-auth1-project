function validateCredentials(req, res, next) {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing user data." });
  } else if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: "Missing username or password." });
  } else {
    next();
  }
}





  
module.exports = { validateCredentials};
