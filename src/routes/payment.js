const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { status } = require("express/lib/response");
const membershipAmount = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const user = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    console.log(order);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savePayment = await payment.save();

    res.json({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });

    // save it to my database
    // Return back my order details to frontend
    // res.json(order);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// paymentRouter.post("/payment/webhook", async (req, res) => {
//   try {
//     const webhookSignature = req.get("X-Razorpay-Signature");
//     const raw = req.rawBody || (req.body && JSON.stringify(req.body));
//     console.log("Webhook Signature", webhookSignature);

//     const isWebhookValid = validateWebhookSignature(
//       raw,
//       webhookSignature,
//       process.env.RAZORPAY_WEBHOOK_SECRET
//     );

//     if (!isWebhookValid) {
//       console.log("IInvalid Webhook Signature");
//       return res.status(400).json({ msg: "Webhook signature is invalid" });
//     }
//      console.log("Valid Webhook Signature");

//     // Update my payment status in DB
//     const paymentDetails = req.body.payload.payment.entity;

//     const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
//     payment.status = paymentDetails.status;
//     await payment.save();
//     console.log("Payment saved");
//     // Update user as Premium

//     const user = await user.findOne({ _id: payment.userId });
//     user.isPremium = true;
//     user.membershipType = payment.notes.membershipType;
//      console.log("User saved");

//     await user.save();

//     // return success response to razorpay

//     // if (req.body.event === "payment.captured") {
//     // }
//     // if (req.body.event === "payment.failed") {
//     // }
//     return res.status(200).json({ msg: "Webhook received successfully!" });
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// paymentRouter.post(
//   "/payment/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     try {
//       const webhookSignature =
//         req.get("X-Razorpay-Signature") || req.get("x-razorpay-signature");
//       const raw = req.body.toString("utf8"); // raw JSON string exactly as received
//       console.log("Raw body:", raw);
//       console.log("Webhook Signature header:", webhookSignature);

//       const isWebhookValid = validateWebhookSignature(
//         raw,
//         webhookSignature,
//         process.env.RAZORPAY_WEBHOOK_SECRET
//       );

//       if (!isWebhookValid) {
//         console.log("Invalid Webhook Signature");
//         return res.status(400).json({ msg: "Webhook signature is invalid" });
//       }
//       console.log("Valid Webhook Signature");

//       const payload = JSON.parse(raw); // now parse from raw
//       const paymentDetails = payload.payload.payment.entity;

//       // rest of your processing...
//       const payment = await Payment.findOne({
//         orderId: paymentDetails.order_id,
//       });
//       if (payment) {
//         payment.status = paymentDetails.status;
//         await payment.save();
//         console.log("Payment saved");
//       } else {
//         console.log("Payment not found for orderId", paymentDetails.order_id);
//       }

//       // update user etc...
//       return res.status(200).json({ msg: "Webhook received successfully!" });
//     } catch (err) {
//       console.error("Webhook handler error", err);
//       return res.status(400).send(err.message);
//     }
//   }
// );
// paymentRouter.js (use normal router, no express.raw here)
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature =
      req.get("X-Razorpay-Signature") || req.get("x-razorpay-signature");
    const raw = req.rawBody; // <-- use captured raw string
    console.log("Webhook Signature", webhookSignature);

    // console.log("Raw body length:", raw ? raw.length : "none");
    // console.log("Raw body (preview):", raw ? raw.slice(0, 1000) : "none");
    // console.log("Webhook Signature header:", webhookSignature);

    if (!raw) {
      console.error(
        "No raw body: verify express.json({verify:...}) is configured BEFORE routes"
      );
      return res.status(400).send("No raw body");
    }

    const isWebhookValid = validateWebhookSignature(
      raw,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("Invalid Webhook Signature");
      // debug: compute expected signature
      const crypto = require("crypto");
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(raw)
        .digest("hex");
      console.log("Expected signature:", expected);
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    console.log("Valid Webhook Signature");

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const userdata = await user.findOne({ _id: payment.userId });
    userdata.isPremium = true;
    userdata.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await userdata.save();

    const payload = JSON.parse(raw);
    // ... handle payload
    return res.status(200).json({ msg: "Webhook received successfully!" });
  } catch (err) {
    console.error("Webhook handler error", err);
    return res.status(400).send(err.message);
  }
});

module.exports = paymentRouter;
