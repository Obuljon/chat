import { model, Schema } from "mongoose";



const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  _id: {
    type: String,
    required: true
  }
});

const ChatSchema = new Schema({
  users: [{
    type: UserSchema,
    required: true
  }],
  messages: [{
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    }
  }]
});

export default model('Chat', ChatSchema);