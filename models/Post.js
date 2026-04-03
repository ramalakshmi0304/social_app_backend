import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: String,
  imageUrl: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String, // The author of the post
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String // <--- Save the liker's name
    }
  ],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String, // <--- Save the commenter's name
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });
// // Ensure at least text or image is present
// postSchema.pre('validate', function(next) {
//   if (!this.content?.trim() && !this.imageUrl?.trim()) {
//     this.invalidate(
//       'content',
//       'Post must have either text or an image.'
//     );
//   }
//   next();
// });
export default mongoose.model('Post', postSchema);