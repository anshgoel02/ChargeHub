import ExpressError from "./utils/expressError.js";
import { chargerSchema, reviewSchema } from "./schemas.js";
import Charger from './models/charger.js';
import Review from './models/review.js';

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!!');
        return res.redirect('/login');
    }
    next();
}

export const validateCharger = (req, res, next) => {
    const { error } = chargerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

export const isAuthorized = async (req, res, next) => {
    const { id } = req.params;
    const charger = await Charger.findById(id);
    if (!charger.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/chargers/${id}`);
    }
    next();
}

export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/chargers/${id}`);
    }
    next();
}

export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}