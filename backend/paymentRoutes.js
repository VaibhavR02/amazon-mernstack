import express from 'express';

import PaytmChecksum from 'paytmchecksum'; // Import Paytm's checksum library
const PaymentRouter = express.Router();

// Generate Paytm Transaction Token
PaymentRouter.post('/generateTransactionToken', async (req, res) => {
  const { amount, orderId, customerId } = req.body;
  const MID = process.env.PAYTM_MID; // Your Paytm Merchant ID
  const MKEY = process.env.PAYTM_MERCHANT_KEY; // Your Paytm Merchant Key
  const CALLBACK_URL = process.env.PAYTM_CALLBACK_URL; // Your callback URL
});

export default PaymentRouter;
