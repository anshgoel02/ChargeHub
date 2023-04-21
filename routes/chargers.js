import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();
const multer = require('multer');
import { storage } from '../cloudinary/index.js';
const upload = multer({ storage });

import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, validateCharger, isAuthorized } from "../middleware.js";
import * as charger from '../controllers/chargers.js';

router.route('/')
    .get(catchAsync(charger.index))
    .post(isLoggedIn, upload.array('images'), validateCharger, catchAsync(charger.create))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('IT WORKED');
// })

router.get('/new', isLoggedIn, charger.newForm);

router.route('/:id')
    .get(catchAsync(charger.showCharger))
    .put(isLoggedIn, isAuthorized, upload.array('images'), validateCharger, catchAsync(charger.editCharger))
    .delete(isLoggedIn, isAuthorized, catchAsync(charger.deleteCharger));

router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(charger.editForm));

export default router;