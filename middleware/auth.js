const jwt = require('jsonwebtoken');
const userModel = require('../models/user')

const useAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.id;
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      throw new Error('User does not exist');
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Unauthorized')
    });
  }
};

module.exports = useAuth;