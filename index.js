const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const db = require('./db');
const path = require('path');
const AppRouter = require('./routes/AppRouter');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const getRawBody = require('raw-body')

const { Order } = require('./models');

require('dotenv').config();
require('./db/index');

const app = express();

const allowedOrigins = ['https://benika.vercel.app', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Middleware to get the raw request body
app.use((req, res, next) => {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb', // Adjust the limit as per your requirements
    encoding: 'utf-8',
  }, (err, rawBody) => {
    if (err) return next(err);
    req.rawBody = rawBody;
    next();
  });
});

// Webhook route to handle Stripe events
app.post('/webhook', (request, response) => {
  let event = request.body;

  if (stripeWebhookSecret) {
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody, // Use the raw request body
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const { buyerEmail, size, color, description, dress } = checkoutSessionCompleted.metadata;
      console.log(`Subscription status is `);
      try {
        Order.create({
          buyer: buyerEmail,
          size: size,
          color: color,
          status: 'pending',
          description: description,
          dress: dress,
        });

        console.log('Order created:', checkoutSessionCompleted.id);
      } catch (e) {
        console.error('Error creating order:', e);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
  response.send();
});

app.use(`/`, AppRouter);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
