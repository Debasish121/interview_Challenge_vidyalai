const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    const postsWithImagesAndUserDetails = await Promise.all(posts.map(async (post) => {
      // Fetch user details for the post
      const user = await fetchUserById(post.userId);

      // Fetch photos for the post
      const { data: photos } = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);

      // Extracting only first three photos for simplicity
      const images = photos.slice(0, 3).map(photo => ({ url: photo.thumbnailUrl }));

      return {
        ...post,
        images,
        userId: user.id,
        username: user.name,
        email: user.email,
      };
    }));

    res.json(postsWithImagesAndUserDetails);
  } catch (error) {
    console.error('Error fetching posts with images and user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
