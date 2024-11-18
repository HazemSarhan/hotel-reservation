import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createReview = async (req: Request, res: Response) => {
  const { hotelId, rating, comment } = req.body;
  if (rating < 1 || rating > 5) {
    throw new BadRequestError('Rating must be between 1 and 5');
  }

  // Checking for hotel availablity
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: parseInt(hotelId, 10),
    },
  });
  if (!hotel) {
    throw new NotFoundError(`No hotel with id ${hotelId} found!`);
  }

  // Check if the user has completed a booking for this hotel
  const completedBooking = await prisma.booking.findFirst({
    where: {
      hotelId: parseInt(hotelId, 10),
      userId: req.body.userId,
      status: 'CONFIRMED', // Only allow reviews for confirmed bookings
    },
  });
  if (!completedBooking) {
    throw new BadRequestError(
      'You can only review hotels that you have booked and completed.',
    );
  }

  // Check if the user has already reviewed the hotel
  const existingReview = await prisma.review.findFirst({
    where: {
      hotelId: parseInt(hotelId, 10),
      userId: req.body.userId,
    },
  });
  if (existingReview) {
    throw new BadRequestError('You have already reviewed this hotel');
  }

  // Create the review
  const newReview = await prisma.review.create({
    data: {
      rating,
      comment,
      userId: req.body.userId,
      hotelId: parseInt(hotelId, 10),
    },
  });

  // Update the average rating and number of reviews for the hotel
  const updatedHotel = await prisma.hotel.update({
    where: {
      id: parseInt(hotelId, 10),
    },
    data: {
      average_rating: {
        increment: rating,
      },
      number_of_reviews: {
        increment: 1,
      },
    },
  });

  res.status(StatusCodes.CREATED).json({ newReview, updatedHotel });
};

export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany();
  res.status(StatusCodes.OK).json({ reviews });
};

export const getReviewById = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(reviewId, 10),
    },
  });
  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId} found!`);
  }
  res.status(StatusCodes.OK).json({ review });
};

export const updateReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const { rating, comment } = req.body;
  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(reviewId, 10),
    },
  });
  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId} found!`);
  }
  const updatedReview = await prisma.review.update({
    where: {
      id: parseInt(reviewId, 10),
    },
    data: {
      rating,
      comment,
    },
  });
  res.status(StatusCodes.OK).json({ updatedReview });
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(reviewId, 10),
    },
  });
  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId} found!`);
  }
  await prisma.review.delete({
    where: {
      id: parseInt(reviewId, 10),
    },
  });
  res.sendStatus(StatusCodes.OK);
};
