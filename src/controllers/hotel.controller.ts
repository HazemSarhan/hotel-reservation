import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import cloudinary from '../configs/cloudinary.config';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';

export const createHotel = async (req: Request, res: Response) => {
  const {
    name,
    description,
    destinationId,
    ownerId,
    propertyId,
    pricePerNight,
  } = req.body;
  if (
    !name ||
    !description ||
    !destinationId ||
    !propertyId ||
    !pricePerNight
  ) {
    throw new BadRequestError('Please provide all required fields');
  }

  let images: string[] = [];
  if (req.files && req.files.images) {
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images // If `images` is an array
      : [req.files.images]; // If `images` is a single file

    for (const file of imageFiles) {
      const imageFile = file as UploadedFile & { tempFilePath: string };

      try {
        const result = await cloudinary.uploader.upload(
          imageFile.tempFilePath,
          {
            use_filename: true,
            folder: 'lms-images',
          },
        );

        images.push(result.secure_url);
        fs.unlinkSync(imageFile.tempFilePath);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload images');
      }
    }
  }

  const hotel = await prisma.hotel.create({
    data: {
      name,
      description,
      destinationId: parseInt(destinationId, 10),
      ownerId,
      propertyId: parseInt(propertyId, 10),
      pricePerNight: parseInt(pricePerNight, 10),
      images,
    },
  });
  res.status(StatusCodes.CREATED).json({ hotel });
};

export const getAllHotels = async (req: Request, res: Response) => {
  const hotels = await prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      pricePerNight: true,
      images: true,
      owner: { select: { id: true, name: true, email: true } },
      location: {
        select: {
          id: true,
          city: true,
          state: true,
          country: true,
          address: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ hotels });
};

export const getHotelById = async (req: Request, res: Response) => {
  const { id: hotelId } = req.params;
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: parseInt(hotelId, 10),
    },
    select: {
      id: true,
      name: true,
      description: true,
      pricePerNight: true,
      images: true,
      owner: { select: { id: true, name: true, email: true } },
      location: {
        select: {
          id: true,
          city: true,
          state: true,
          country: true,
          address: true,
        },
      },
    },
  });
  if (!hotel) {
    throw new NotFoundError(`No hotel with id ${hotelId} found!`);
  }
  res.status(StatusCodes.OK).json({ hotel });
};

export const updateHotel = async (req: Request, res: Response) => {
  const { id: hotelId } = req.params;
  const { name, description, destinationId, propertyId, pricePerNight } =
    req.body;

  let images: string[] = [];
  if (req.files && req.files.images) {
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images // If `images` is an array
      : [req.files.images]; // If `images` is a single file

    for (const file of imageFiles) {
      const imageFile = file as UploadedFile & { tempFilePath: string };

      try {
        const result = await cloudinary.uploader.upload(
          imageFile.tempFilePath,
          {
            use_filename: true,
            folder: 'lms-images',
          },
        );

        images.push(result.secure_url);
        fs.unlinkSync(imageFile.tempFilePath);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload images');
      }
    }
  }

  const hotel = await prisma.hotel.findUnique({
    where: {
      id: parseInt(hotelId, 10),
    },
  });

  if (!hotel) {
    throw new NotFoundError(`No hotel with id ${hotelId} found!`);
  }

  const updatedHotel = await prisma.hotel.update({
    where: {
      id: parseInt(hotelId, 10),
    },
    data: {
      name,
      description,
      destinationId: parseInt(destinationId, 10),
      propertyId: parseInt(propertyId, 10),
      pricePerNight: parseInt(pricePerNight, 10),
      images,
    },
  });

  res.status(StatusCodes.OK).json({ updatedHotel });
};

export const deleteHotel = async (req: Request, res: Response) => {
  const { id: hotelId } = req.params;
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: parseInt(hotelId, 10),
    },
  });
  if (!hotel) {
    throw new NotFoundError(`No hotel with id ${hotelId} found!`);
  }

  const deleteHotel = await prisma.hotel.delete({
    where: {
      id: parseInt(hotelId, 10),
    },
  });
  res.status(StatusCodes.OK).json({ msg: `Hotel has been deleted` });
};
