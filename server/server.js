import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './config/passport.js';

import authRoute from './routers/authRoute.js';
import campaignRoute from './routers/campaignRoute.js';
import smtpRoute from './routers/smtpRoute.js';
import subscriberRoute from './routers/subscriberRoute.js';
import templateRoute from './routers/templateRoute.js';
import userRoute from './routers/userRoute.js';
import subscriberListRoute from './routers/subscriberListRoute.js';
import afterCampaignRoute from './routers/afterCampaignRoute.js';

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.get('/', async (req, res) => {
  res.send('wefn hello');
});
app.use('/auth', authRoute);
app.use('/campaign', campaignRoute);
app.use('/smtp', smtpRoute);
app.use('/subscriber', subscriberRoute);
app.use('/subscriberList', subscriberListRoute);
app.use('/template', templateRoute);
app.use('/user', userRoute);
app.use('/aftercampaign',afterCampaignRoute)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
