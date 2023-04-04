const express = require('express');
const router = express.Router();
const axios = require('axios')

const moviesModel = require('../models/movies')
const genreModel = require('../models/genre')

router.get('/getMovies', async (req, res) => {
  let page = 1;
  let totalPage;

  await moviesModel.deleteMany({});
  const genres = await genreModel.find({})
  do {
    try {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=03732a642aba67864e7018998055639d&language=en-US&page=${page}`)
      const list = data.results.map((item) => {
        const itemGenres = item.genre_ids
          .map((id) => genres.find((genre) => Number(genre.id) === id)?._id)
          .filter((id) => !!id)
        return {
          ...item,
          genre_ids: itemGenres
        }
      })
      const query = await moviesModel.insertMany(list);
      totalPage = data.total_pages;
    } catch (err) {
      console.error(err.message);
    } finally {
      page += 1;
    }
  } while (page <= totalPage);

  return res.status(200).end();
})

module.exports = router;