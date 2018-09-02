var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/data');

var ScratchProjectSchema = new mongoose.Schema( {
  owner: {
    type: String,
    required: true    
  },
  data: {
      type: Buffer
  },
});

var ProjectInfoSchema = new mongoose.Schema( {
  title: {
      type: String,
      required: true
  },
  projectId: {
      type: String,
      required: true    
  }
});

var ScratchProject = mongoose.model('Project', ScratchProjectSchema);

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
  projects: [ProjectInfoSchema]
});
var User = mongoose.model('User', UserSchema);
module.exports = { User, ScratchProject };
