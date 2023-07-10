const mongoose2 = require('mongoose');

const URI = 'mongodb://localhost:27017/datosViales2023';


    mongoose2.connect(URI, {
      useMongoClient: true
    })
    .then(db => console.log('datosViales2023 DB is connected'))
    .catch(err => console.log(err))

module.exports = mongoose2;