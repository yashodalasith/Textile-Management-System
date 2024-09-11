const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI)
        .then(con => {
            console.log(`MongoDB is connected: ${con.connection.host}`);
        })
        .catch(err => {
            console.log('MongoDB connection error:', err);
        });
};

module.exports = connectDatabase;
