const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// see https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-ancestors-array/
const Comment = new Schema({
  text: {
    type: 'string',
    required: true,
    trim: true,
    maxlength: 1500
  },
  postedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  ancestors: [{
    type: Schema.Types.ObjectId,
    ref: 'comments'
  }],
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'comments'
  }
});

/**
 * Comment - creates a new instance of Comment
 *
 * @param  {string} text
 * @param  {date} postedBy
 * @param  {[Schema.Types.ObjectId]} ancestors
 * @param  {Schema.Types.ObjectId} parent
 * @return {Promise}
 */
Comment.statics.create = function(data) {
  const self = this;

  return new Promise(function(resolve, reject) {
    const comment = new self(data);
    comment.save(function(err) {
      if (err) return reject(err);

      resolve(comment);
    });
  });
};


/**
 * Comment - gets all comments
 *
 * @return {Promise}
 */
Comment.statics.getAll = function() {
  return this.find().exec();
};


/**
 * Comment - gets a comment with max level of depth in the comment tree.
 *
 * @return {Promise}
 */
Comment.statics.getMaxDepth = function() {
  const self = this;

  return new Promise(function(resolve, reject) {
    self.aggregate([{
      $project: {
        _id: 1,
        text: 1,
        postedAt: 1,
        postedBy: 1,
        depth: { $size: '$ancestors' }
      }},
      { $sort: { depth: -1 } },
      { $limit: 1 }
    ])
    .exec(function(err, comments) {
      if (err) return reject(err);

      resolve(comments.length > 0 ? comments[0] : null);
    });
  });
};

mongoose.model('comments', Comment);
