const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');

const cors = require('cors');


// Use CORS to allow requests from different origins
app.use(cors());


dotenv.config({ path: path.join(__dirname, "config/config.env") });  // wants to give absolute path than only can access


const loginRouter = require('./Routes/UserLoginRoute');
const userRouter = require('./Routes/UserManagmentRoute');
const UserProfile = require("./Routes/UserProfileRoutes")

app.use(express.json());
app.use('/login',loginRouter);
app.use('/user',userRouter);
app.use('/userProfile',UserProfile)



connectDatabase();

app.listen(process.env.PORT || 8000,  () => {
    console.log(`Server Listening to port: ${process.env.PORT } in ${process.env.NODE_ENV}`);

});

