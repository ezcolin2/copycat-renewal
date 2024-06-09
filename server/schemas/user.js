import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

export default User;
