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

Comment.statics.create = function(text, postedBy, ancestors, parent) {
  return new Promise(function(resolve, reject) {
    const comment = new Comment({
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

mongoose.model('comments', Comment);
