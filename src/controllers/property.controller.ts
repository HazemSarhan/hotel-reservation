import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createProperty = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) {
    throw new BadRequestError('Please provide a property name');
  }
  const property = await prisma.property.create({
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.CREATED).json({ property });
};

export const getAllProperties = async (req: Request, res: Response) => {
  const properties = await prisma.property.findMany();
  res.status(StatusCodes.OK).json({ properties });
};

export const getPropertyById = async (req: Request, res: Response) => {
  const { id: propertyId } = req.params;
  const property = await prisma.property.findUnique({
    where: {
      id: parseInt(propertyId, 10),
    },
  });
  if (!property) {
    throw new NotFoundError(`No property with id ${propertyId} found!`);
  }
  res.status(StatusCodes.OK).json({ property });
};

export const updateProperty = async (req: Request, res: Response) => {
  const { id: propertyId } = req.params;
  const { name, description } = req.body;
  const property = await prisma.property.update({
    where: {
      id: parseInt(propertyId, 10),
    },
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.OK).json({ property });
};

export const deleteProperty = async (req: Request, res: Response) => {
  const { id: propertyId } = req.params;
  const property = await prisma.property.findUnique({
    where: {
      id: parseInt(propertyId, 10),
    },
  });
  if (!property) {
    throw new NotFoundError(`No property with id ${propertyId} found!`);
  }
  const deleteProperty = await prisma.property.delete({
    where: {
      id: parseInt(propertyId, 10),
    },
  });
  res.status(StatusCodes.OK).json({ msg: `Property has been deleted` });
};
