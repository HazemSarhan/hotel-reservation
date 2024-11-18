import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createDestination = async (req: Request, res: Response) => {
  const { city, state, country, address, description } = req.body;
  if (!city || !state || !country || !address) {
    throw new BadRequestError('Please provide all required fields');
  }
  const destination = await prisma.destination.create({
    data: {
      city,
      state,
      country,
      address,
      description,
    },
  });
  res.status(StatusCodes.CREATED).json({ destination });
};

export const getAllDestinations = async (req: Request, res: Response) => {
  const destinations = await prisma.destination.findMany();
  res.status(StatusCodes.OK).json({ destinations });
};

export const getDestinationById = async (req: Request, res: Response) => {
  const { id: destinationId } = req.params;
  const destination = await prisma.destination.findUnique({
    where: {
      id: parseInt(destinationId, 10),
    },
  });
  if (!destination) {
    throw new NotFoundError(`No destination with id ${destinationId} found!`);
  }
  res.status(StatusCodes.OK).json({ destination });
};

export const updateDestination = async (req: Request, res: Response) => {
  const { id: destinationId } = req.params;
  const { city, state, country, address, description } = req.body;
  const destination = await prisma.destination.update({
    where: {
      id: parseInt(destinationId, 10),
    },
    data: {
      city,
      state,
      country,
      address,
      description,
    },
  });
  res.status(StatusCodes.OK).json({ destination });
};

export const deleteDestination = async (req: Request, res: Response) => {
  const { id: destinationId } = req.params;
  const destination = await prisma.destination.findUnique({
    where: { id: parseInt(destinationId, 10) },
  });
  if (!destination) {
    throw new NotFoundError(`No destination with id ${destinationId} found!`);
  }
  const destinationDeleted = await prisma.destination.delete({
    where: {
      id: parseInt(destinationId, 10),
    },
  });
  res.status(StatusCodes.OK).json({ msg: `Destination has been deleted` });
};
