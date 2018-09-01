var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/data');

var ScratchProjectSchema = new mongoose.Schema( {
  title: {
      type: String,
      required: true
  },
  owner: {
    type: String,
    required: true    
  },
  data: {
      type: Buffer
  },
});

var ScratchProject = mongoose.model('ScratchProject', ScratchProjectSchema);

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  projects: [[String]]
});
var User = mongoose.model('User', UserSchema);
module.exports = { User, ScratchProject };
