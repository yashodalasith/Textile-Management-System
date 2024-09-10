const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(con => {
            console.log(`MongoDB is connected: ${con.connection.host}`);
        })
        .catch(err => {
            console.log('MongoDB connection error:', err);
        });
};

module.exports = connectDatabase;
