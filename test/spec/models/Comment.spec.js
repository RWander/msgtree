'use strict';

/* eslint-env jasmine */
/* eslint-disable no-console */

describe('Comment model tests', function()  {
  const _ = require('lodash');
  const Comment = require('mongoose').model('comments');

  it('test getMaxDepth method', function(done) {
    Comment.find(null, { ancestors: 1 }).lean().exec(function(err, comments) {
      if (err) throw err;

      const maxDepthComment = _.maxBy(comments, comment => comment.ancestors.length);

      Comment.getMaxDepth().then(
        comment => {
          expect(comment._id).toEqual(maxDepthComment._id);
          expect(comment.depth).toBe(maxDepthComment.ancestors.length);
          done();
        },
        err => done(err)
      );
    });
  });
});
