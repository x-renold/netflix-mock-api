const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const useAuth = require('../middleware/auth');

const userModel = require('../models/user');

/* GET users listing. */
router.get('/', useAuth, async function (req, res, next) {
  try {
    const users = await userModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});

router.post('/', async function (req, res) {
  const isExist = await userModel.findOne({ email: req.body.email })
  if (isExist) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  try {
    const result = await newUser.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email, password: req.body.password })
    if (user) {
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.TOKEN_SECRET,
        { expiresIn: '3h' }
      );
      return res.status(200).json({ success: true, token });
    }
    return res.status(400).json({ error: 'invalid_credentials', message: 'The email and passwords do not match' });
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});

module.exports = router;
