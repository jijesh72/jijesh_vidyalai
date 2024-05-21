const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const { default: axios } = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  
  const {start,limit}=req.query;
  const posts = await fetchPosts({start,limit});

  // const userId=await fetchUserById()

  const postsWithImages = await Promise.all(
    posts.map(async post => {
      // TODO use this route to fetch photos for each post
      const images=await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      const { data: user } = await fetchUserById(post.userId);
      
      // console.log(images);
      return {
        ...post,
        images: images.data,
        user
      };
    }, []),
  );

  res.json(postsWithImages);
});

module.exports = router;
