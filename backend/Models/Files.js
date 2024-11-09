import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {type: String},
  type: {type: String},
  content: {type: String},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const fileModel = mongoose.model('Files', fileSchema);
export default fileModel;