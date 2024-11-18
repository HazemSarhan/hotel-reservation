import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15' as Stripe.LatestApiVersion,
});

export const createPayment = async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(bookingId, 10) },
  });
  if (!booking) {
    throw new NotFoundError(`No booking with id ${bookingId} found!`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Booking',
          },
          unit_amount: booking.totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/api/v1/success?bookingId=${booking.id}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: {
      bookingId: booking.id.toString(),
    },
  });

  const payment = await prisma.payment.create({
    data: {
      bookingId,
      userId: req.body.userId,
      totalPrice: booking.totalPrice,
      stripeSessionId: session.id,
    },
  });

  res.status(StatusCodes.OK).json({ url: session.url });
};

export const getAllPayments = async (req: Request, res: Response) => {
  const payments = await prisma.payment.findMany();
  res.status(StatusCodes.OK).json({ payments });
};

export const getPaymentById = async (req: Request, res: Response) => {
  const { id: paymentId } = req.params;
  const payment = await prisma.payment.findUnique({
    where: {
      id: parseInt(paymentId, 10),
    },
  });
  if (!payment) {
    throw new NotFoundError(`No payment with id ${paymentId} found!`);
  }
  res.status(StatusCodes.OK).json({ payment });
};

export const handleSuccess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bookingId = req.query.bookingId as string;

  if (!bookingId) {
    // Ensure an early return to avoid further execution
    res.status(400).send('Missing booking ID');
  }

  await prisma.booking.update({
    where: { id: parseInt(bookingId) },
    data: { status: 'CONFIRMED' },
  });

  res.status(200).send('Booking confirmed!');
};
