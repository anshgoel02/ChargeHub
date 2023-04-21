import Charger from '../models/charger.js';
import Review from '../models/review.js';


export const create = async (req, res) => {
    const { id } = req.params;
    const charger = await Charger.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    charger.reviews.push(review);
    await review.save();
    await charger.save();
    req.flash('success', 'Created new review');
    res.redirect(`/chargers/${id}`);
}

export const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Charger.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/chargers/${id}`);
}