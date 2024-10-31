import dotenv from "dotenv";
import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import productModel from "../../product/models/product.model.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import Stripe from "stripe";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const getUserOrders = catchAsyncError(async (req, res) => {
  const apiFeatures = new apiFeatures(
    orderModel.find({ user_id: req.user._id })
  ).paginate(10);
  const orders = await apiFeatures.query;
  res.json({ orders });
});

export const makeCODOrder = catchAsyncError(async (req, res) => {
  const cart = await cartModel.findOne({ user_id: req.user_id });

  cart.products.forEach((product) => {
    if (product.product_id.stock < product.quantity)
      throw new AppError("Insufficient stock", 400);
  });

  const order = await orderModel.create({
    user_id: req.user_id,
    coupon: {
      discount: cart.coupon_id?.discount || 0,
    },
    products: cart.products.map(
      ({ product_id: { title, price, discounted_price }, quantity }) => ({
        quantity,
        product: {
          title,
          price,
          discounted_price,
        },
      })
    ),
    ...req.body,
  });

  if (!order) throw new AppError("Order failed, 400");

  const bulkWriteOptions = cart.products.map(
    ({ product_id: { _id }, quantity }) => ({
      updateOne: {
        filter: { _id },
        update: {
          $inc: {
            stock: -quantity,
          },
        },
      },
    })
  );

  await productModel.bulkWrite(bulkWriteOptions);

  res.json({ order });
});

export const makePaymentSession = catchAsyncError(async (req, res) => {
  const cart = await cartModel.findOne({ user_id: req.user_id });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "EGP",
          unit_amount: cart.total_price * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "",
    cancel_url: "",
    client_reference_id: cart._id,
    customer_email: req.user.email,
  });

  res.json({ session });
});
