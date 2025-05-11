const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    let token = req.headers['authorization'].split(' ')[1];
    let user = jwt.verify(token, process.env.JWT_SECRET);
  if (!user.admin){
      return res.status(403).json({message: 'Unauthorized'});
    } 
    next();
  } catch (err){
    res.status(401).json({message: 'Authentication error.'})
  }
}