import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: {
        type: Number,
        max: 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model('Review', reviewSchema);