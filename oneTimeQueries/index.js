const express = require('express');
const router = express.Router();
const axios = require('axios')

const moviesModel = require('../models/movies')

router.get('/getMovies', async (req, res) => {
  let page = 1;
  let totalPage;

  await moviesModel.deleteMany({});

  do {
    try {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=03732a642aba67864e7018998055639d&language=en-US&page=${page}`)
      const query = await moviesModel.insertMany(data.results);
      totalPage = data.total_pages;
      console.log(query);
    } catch (err) {
      console.error(err);
    } finally {
      page += 1;
    }
  } while (page <= totalPage);

  return res.status(200).json(data);
})

module.exports = router;