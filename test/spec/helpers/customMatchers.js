'use strict';

/*eslint-env jasmine */

beforeEach(function () {
  var _ = require('lodash');

  jasmine.addMatchers({
    hasFields: () => {
      return {
        compare: (obj, fields) => {
          var objFields = Object.keys(obj);
          return {
            pass: objFields.length === fields.length && _.xor(objFields, fields).length === 0
          };
        }
      };
    }
  });
});
