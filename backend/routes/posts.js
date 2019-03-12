const express = require('express');

const PostController = require('../controllers/posts');

const checkauth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkauth, extractFile, PostController.createPost);

router.put('/:id', checkauth, extractFile, PostController.updatePost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.delete('/:id', checkauth, PostController.deletePost);

module.exports = router;
