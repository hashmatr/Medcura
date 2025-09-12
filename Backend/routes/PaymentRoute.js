import express from 'express';
import { 
  createPaymentIntent, 
  confirmPayment, 
  stripeWebhook, 
  getPaymentStatus 
} from '../controllers/userController.js';
import AuthUser from '../middleware/AuthUser.js';

const paymentRouter = express.Router();

// Create payment intent for appointment
paymentRouter.post('/create-payment-intent', AuthUser, createPaymentIntent);

// Confirm payment after successful payment
paymentRouter.post('/confirm-payment', AuthUser, confirmPayment);

// Get payment status for an appointment
paymentRouter.get('/payment-status/:appointmentId', AuthUser, getPaymentStatus);

// Stripe webhook (no auth middleware needed)
paymentRouter.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);

export default paymentRouter;