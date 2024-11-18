import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createBooking = async (req: Request, res: Response) => {
  const { hotelId, checkIn, checkOut } = req.body;

  if (!hotelId || !checkIn || !checkOut) {
    throw new BadRequestError('Missing required fields');
  }

  // Convert the checkIn and checkOut fields to Date objects
  const parsedCheckIn = new Date(checkIn);
  const parsedCheckOut = new Date(checkOut);

  // Validate the dates
  if (isNaN(parsedCheckIn.getTime()) || isNaN(parsedCheckOut.getTime())) {
    throw new BadRequestError(
      'Invalid date format. Expected ISO-8601 DateTime.',
    );
  }

  // Ensure checkOut is after checkIn
  if (parsedCheckIn >= parsedCheckOut) {
    throw new BadRequestError('Check-out date must be after check-in date');
  }

  // Fetch the hotel price per night
  const hotel = await prisma.hotel.findUnique({
    where: { id: parseInt(hotelId) },
    select: { pricePerNight: true },
  });

  if (!hotel) {
    throw new BadRequestError(`No hotel found with id ${hotelId}`);
  }

  const pricePerNight = hotel.pricePerNight;

  // Calculate the total number of days
  const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
  const numberOfDays = Math.ceil(
    (parsedCheckOut.getTime() - parsedCheckIn.getTime()) / oneDay,
  );

  // Calculate the total price
  const totalPrice = pricePerNight * numberOfDays;

  // Create the booking
  const booking = await prisma.booking.create({
    data: {
      userId: req.body.userId,
      hotelId: parseInt(hotelId),
      checkIn: parsedCheckIn,
      checkOut: parsedCheckOut,
      totalPrice,
    },
  });

  res.status(201).json({ booking });
};

export const getAllBookings = async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany();
  res.status(StatusCodes.OK).json({ bookings });
};

export const getBookingById = async (req: Request, res: Response) => {
  const { id: bookingId } = req.params;
  const booking = await prisma.booking.findUnique({
    where: {
      id: parseInt(bookingId, 10),
    },
  });
  if (!booking) {
    throw new NotFoundError(`No booking with id ${bookingId} found!`);
  }
  res.status(StatusCodes.OK).json({ booking });
};

export const getAllConfirmedBookings = async (req: Request, res: Response) => {
  const confirmedBookings = await prisma.booking.findMany({
    where: { status: 'CONFIRMED' },
  });
  res.status(StatusCodes.OK).json({ confirmedBookings });
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id: bookingId } = req.params;
  const { status } = req.body;
  const booking = await prisma.booking.update({
    where: {
      id: parseInt(bookingId, 10),
    },
    data: {
      status,
    },
  });
  res.status(StatusCodes.OK).json({ booking });
};
