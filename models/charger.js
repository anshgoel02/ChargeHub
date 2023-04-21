import { Schema, model } from 'mongoose';
import Review from './review.js';

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumb').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const ChargerSchema = new Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

ChargerSchema.virtual('properties.popupMarkup').get(function () {
    // return `<a href="/chargers/${this._id}">hello</a>`;
    return `<div class='container'><a class='btn fw-bold' href=/chargers/${this._id}>${this.title}</a><p>${this.description.substring(0, 20)}...</p></div>`;
})

ChargerSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

export default model('Charger', ChargerSchema);