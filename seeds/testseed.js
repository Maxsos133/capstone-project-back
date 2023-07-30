const db = require("../db");
const { Dress } = require("../models");

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const main = async () => {
  const dresses = [
    {
        name: 'Elegant Dress',
        image: 'https://i.imgur.com/wcKZRVV.jpg',
        description: 'Classic and elegant dress',
        price: '109.99'
    }
  ]
  await Dress.insertMany(dresses);
  console.log(`Created test!`);
};

const run = async () => {
  await main();
  db.close();
};

run();
