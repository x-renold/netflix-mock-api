const express = require('express');
const router = express.Router();
const axios = require('axios')

const moviesModel = require('../models/movies')
const genreModel = require('../models/genre')



router.get('/genre', async (req, res) => {
  try {
    const list = await genreModel.find({});
    return res.status(200).json(list)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/', async (req, res) => {
  if (!req.query.page || !req.query.pageSize) {
    return res.status(401).json({ message: 'Params missing' })
  }
  try {
    const offset = (Number(req.query.page) - 1) * Number(req.query.pageSize);
    console.log(offset);
    const movies = await moviesModel.paginate(
      {},
      {
        limit: req.query.pageSize, offset,
        populate: 'genre_ids'
      }
    );
    return res.status(200).json(movies);
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/:movieId', async (req, res) => {
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/315162?api_key=${process.env.MOVIE_DB_KEY}&language=en-US`)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

module.exports = router;