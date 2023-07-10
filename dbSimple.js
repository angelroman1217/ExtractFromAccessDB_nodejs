const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/datosTest2023';

mongoose.connect(URI)

module.exports = mongoose;