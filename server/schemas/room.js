import mongoose from 'mongoose';

const { Schema } = mongoose;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  master: {
    type: String,
    required: true
  },
  participant: {
    type: String,
    required: false
  },
  isPrivate: {
    type: Boolean,
    required: false
  },
  password: {
    type: String,
    required: false
  }

});

const Room = mongoose.model('Room', roomSchema);

export default Room;
