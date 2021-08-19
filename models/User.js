const { Schema, model } = require('mongoose');
//const dateFormat = require('../utils/dateFormat');

var validateEmail = function(email) {
    var regx = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    return regx.test(email)
};


const UserSchema = new Schema(
  {
    user: {
      type: String,
      unique: ture,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: ture,
      validate: [validateEmail, 'Please fill a valid email address'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [self]
  },
  {
    toJSON: {
      virtuals: true,
  //     getters: true
    },
    // prevents virtuals from creating duplicate of _id as `id`
    id: false
  }
);

// get total count of comments and replies on retrieval
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length
});

const User = model('user', UserSchema);

module.exports = User;
