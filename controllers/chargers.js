import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Charger from '../models/charger.js';
import { cloudinary } from '../cloudinary/index.js';
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapboxToken });

export const index = async (req, res) => {
    const chargers = await Charger.find({});
    res.render('chargers/index', { chargers });
}

export const newForm = (req, res) => {
    res.render('chargers/new');
}

export const create = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.charger.location,
        limit: 1
    }).send();

    const charger = new Charger(req.body.charger);
    charger.geometry = geoData.body.features[0].geometry;
    charger.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    charger.author = req.user._id;
    await charger.save();
    console.log(charger);
    req.flash('success', 'Charger created successfully!');
    res.redirect('/chargers')
}

export const showCharger = async (req, res) => {
    const { id } = req.params;
    const charger = await Charger.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    })
        .populate('author');
    if (!charger) {
        req.flash('error', 'Cannot find that charger');
        return res.redirect('/chargers');
    }
    res.render('chargers/show', { charger });
}

export const editForm = async (req, res) => {
    const { id } = req.params;
    const charger = await Charger.findById(id);
    if (!charger) {
        req.flash('error', 'Cannot find that charger');
        return res.redirect('/chargers');
    }
    res.render('chargers/edit', { charger });
}

export const editCharger = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const charger = await Charger.findByIdAndUpdate(id, { ...req.body.charger });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    charger.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await charger.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(charger);
    }
    await charger.save();
    req.flash('success', 'Charger updated successfully');
    res.redirect(`/chargers/${id}`);
}

export const deleteCharger = async (req, res) => {
    const { id } = req.params;
    await Charger.findByIdAndDelete(id);
    req.flash('success', 'Charger deleted successfully');
    res.redirect('/chargers');
}