const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdpost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        id: createdpost._id,
        title: createdpost.title,
        content: createdpost.content,
        imagePath: createdpost.imagePath
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Post creation failed!'
    });
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
      .then(result => {
        console.log(result);
        if (result.n > 0) {
        res.status(200).json({message: 'Update successful!'});
      } else {
        res.status(401).json({ message: 'Not Authorized!'});
      }
      })
      .catch(error => {
        res.status(500).json({
          message: "Could not update post!"
        })
      });
};

exports.getPosts = (req, res, next) => {
  const pagesize = +req.query.pagesize;
  const currentpage = +req.query.page;
  const postquery = Post.find();
  let fetchedposts;
  if (pagesize && currentpage) {
    postquery.skip(pagesize * (currentpage - 1))
    .limit(pagesize);
  }
  postquery.then(docs => {
    fetchedposts = docs;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: fetchedposts,
      maxposts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching posts failed!'
    });
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching post failed!'
    });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({message: 'Deletion successful!'});
    } else {
      res.status(401).json({ message: 'Not Authorized!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Deleting posts failed!'
    });
  });
};
