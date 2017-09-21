'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

// @@@@@@@@@@@@@@@@@ BLOG POST MODEL @@@@@@@@@@@@@@@
const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// @@@@@@@@@@@@@@@@@ USER MODEL @@@@@@@@@@@@@@@

const userSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.apiRepr = function() {
  return {
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    username: this.username || ''
  };
};

const UserModel = mongoose.model('User', userSchema);

module.exports = {BlogPost, UserModel};
