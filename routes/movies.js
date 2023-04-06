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

router.post('/favourite', async (req, res) => {
  try {
    if (!req.body.movieId) {
      return res.status(400).json({ message: 'MovieId field missing' })
    }
    const movie = await moviesModel.findOne({ id: req.body.movieId }).select({ _id: 1 });
    if (!movie) {
      return res.status(400).json({ message: 'Movie not found' });
    }
    const user = req.user;
    if (user.favouriteMovies.includes(movie._id)) {
      return res.status(400).json({ message: 'Movie already marked as favourite' })
    }
    user.favouriteMovies.push(movie._id);
    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/favourite', async (req, res) => {
  try {
    if (!req.query.page || !req.query.pageSize) {
      return res.status(401).json({ message: 'Params missing' })
    }
    const offset = (Number(req.query.page) - 1) * Number(req.query.pageSize);

    const user = req.user;
    const favourites_ids = user.favouriteMovies;
    const favouriteMovies = await moviesModel.paginate(
      {
        _id: { $in: favourites_ids }
      },
      {
        limit: req.query.pageSize, offset,
        populate: 'genre_ids'
      }
    );
    return res.status(200).json(favouriteMovies)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.delete('/favourite', async (req, res) => {
  try {
    if (!req.body.movieId) {
      return res.status(400).json({ message: 'MovieId field missing' })
    }
    const user = req.user;
    if (!user.favouriteMovies.includes(req.body.movieId)) {
      return res.status(400).json({ message: 'Movie not marked as favourite' })
    }
    const fav_ids = user.favouriteMovies;
    const index = fav_ids.findIndex((id) => id === req.body.movieId);
    fav_ids.splice(index, 1);
    const query = await user.save();
    return res.status(200).json({ success: true, query })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/', async (req, res) => {
  if (!req.query.page || !req.query.pageSize) {
    return res.status(401).json({ message: 'Params missing' })
  }
  const sort = {}
  let where = {};
  if (req.query.orderBy === 'vote') {
    sort.vote_average = -1;
  } else if (req.query.orderBy === 'release_date') {
    sort.release_date = -1;
    if (!req.query.upcoming) {
      where = { release_date: { $lt: new Date() } }
    }
  } else if (req.query.orderBy === 'name') {
    sort.title = 1
  } else {
    sort.popularity = -1;
  }
  if (req.query.upcoming) {
    where.release_date = { $gt: new Date() }
  } else {
    where.release_date = { $lt: new Date() }
  }
  if (req.query.genre) {
    where.genre_ids = req.query.genre;
  }
  try {
    const offset = (Number(req.query.page) - 1) * Number(req.query.pageSize);
    const movies = await moviesModel.paginate(
      { ...where },
      {
        limit: req.query.pageSize, offset,
        populate: 'genre_ids',
        sort
      }
    );
    return res.status(200).json(movies);
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/:movieId', async (req, res) => {
  if (!req.params.movieId) {
    return res.status(400).json({ message: 'MovieId field missing' })
  }
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.movieId}?api_key=${process.env.MOVIE_DB_KEY}&language=en-US`)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});

module.exports = router;