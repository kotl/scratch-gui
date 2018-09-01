var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/data');

var ScratchProjectSchema = new mongoose.Schema( {
  title: {
      type: String,
      unique: true,
      required: true
  },
  data: {
      type: String
  },
});

var ScratchProject = mongoose.model('ScratchProject', ScratchProjectSchema);

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  projects: [[ScratchProjectSchema]]
});
var User = mongoose.model('User', UserSchema);
module.exports = { User, ScratchProject };
