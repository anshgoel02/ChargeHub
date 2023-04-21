import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router({ mergeParams: true });
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, validateReview, isReviewAuthor } from '../middleware.js';
import * as review from '../controllers/reviews.js';


router.post('/', isLoggedIn, validateReview, catchAsync(review.create));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

export default router;