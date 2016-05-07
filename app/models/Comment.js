const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
  text: {
    type: 'string',
    required: true,
    trim: true,
    maxlength: 150
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  ancestors: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
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
Comment.statics.create = function(text, postedBy, ancestors, parent) {
  const self = this;

  return new Promise(function(resolve, reject) {
    const comment = new self({
      text,
      postedBy,
      ancestors,
      parent
    });
    comment.save(function(err) {
      if (err) return reject(err);

      resolve(comment);
    });
  });
};


Comment.statics.find = function() {
  const self = this;

  return new Promise(function(resolve, reject) {
    // TODO
    // ..
  });
};

Comment.statics.getMaxDepth = function() {
  const self = this;

  return new Promise(function(resolve, reject) {
    // TODO
    // ..
  });
};

mongoose.model('comments', Comment);
