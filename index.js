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
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
});

// ... (other middleware and routes)

app.post("/create-checkout-session", async (req, res) => {
  const { buyerEmail, size, color, description, dress, customSizeValues } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity
        };
      }),
      metadata: {
        buyerEmail,
        size,
        color,
        description,
        dress,
        customSizeValues,
      },
      success_url: 'http://localhost:5173/startorder',
      cancel_url: 'http://localhost:5173/startorder'
    });

    // Send the Stripe session URL to the client
    res.json({ url: session.url });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Add bodyParser middleware to parse incoming webhook events from Stripe
app.use(express.raw({ type: 'application/json' }));

// Webhook route to handle Stripe events
app.post('/webhook', async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, stripeWebhookSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const { buyerEmail, size, color, description, dress } = checkoutSessionCompleted.metadata;

      try {
        const newOrder = await Order.create({
          buyer: buyerEmail,
          size: size,
          color: color,
          status: 'pending',
          description: description,
          dress: dress,
        });

        console.log('Order created:', newOrder.id);
      } catch (e) {
        console.error('Error creating order:', e);
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(`/`, AppRouter);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
