import mongoose, { connect } from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: 'Hey there, using PetMy!'
  },
  profile_picture: {
    type: String,
    default: ''
  },
    cover_photo: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  full_name: {
    type: String,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  connected_users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
},{ timestamps: true, minimize: false });

const User = mongoose.model('User', userSchema);

export default User;