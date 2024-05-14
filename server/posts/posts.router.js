const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const { default: axios } = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  
  const {start,limit}=req.query;
  const posts = await fetchPosts({start,limit});

  const postsWithImages = await Promise.all(
    posts.map(async post => {
      // TODO use this route to fetch photos for each post
      const images=await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      
      console.log(images);
      return {
        ...post,
        images: images.data
      };
    }, []),
  );

  res.json(postsWithImages);
});

module.exports = router;