import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

import Charger from '../models/charger.js';
import cities from './cities.js';
import { descriptors, places } from './seedsHelper.js';

mongoose.connect('mongodb://127.0.0.1:27017/chargeHub');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Charger.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const charger = new Charger({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2),
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, mollitia, explicabo reiciendis libero, ullam culpa aliquam voluptatibus ducimus beatae unde hic doloribus. Distinctio dolorum eaque aspernatur ipsa ratione tenetur esse.',
            images: [
                {
                    url: 'https://res.cloudinary.com/ddxcouoem/image/upload/v1680696998/ChargerHub/usk16t4plm22a0b3znrz.jpg',
                    filename: 'ChargerHub/usk16t4plm22a0b3znrz',
                },
                {
                    url: 'https://res.cloudinary.com/ddxcouoem/image/upload/v1680696998/ChargerHub/h8watdxtohbs99m5rtix',
                    filename: 'ChargerHub/giadirpbccle5zrbigbp',
                },
                {
                    url: 'https://res.cloudinary.com/ddxcouoem/image/upload/v1680696999/ChargerHub/oqxxvtclvi4txsddych3.jpg',
                    filename: 'ChargerHub/oqxxvtclvi4txsddych3',
                },
                {
                    url: 'https://res.cloudinary.com/ddxcouoem/image/upload/v1680696999/ChargerHub/ggqgfz8vixught5vvkhh.jpg',
                    filename: 'ChargerHub/ggqgfz8vixught5vvkhh',
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            author: '64286920d8962e18185a757a'
        });
        // const geoData = await geoCoder.forwardGeocode({
        //     query: charger.location,
        //     limit: 1
        // }).send();

        // charger.geometry = geoData.body.features[0].geometry;
        await charger.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});