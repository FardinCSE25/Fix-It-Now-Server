import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBookingIntoDB = async (customerId: string, serviceId: string) => {

    const service = await prisma.service.findUniqueOrThrow({
        where: {
            id: serviceId,
        },
    });

    const isBookingAlreadyExist = await prisma.booking.findFirst({
        where: {
            customerId,
            serviceId
        }
    })

    if (isBookingAlreadyExist) {
        throw new Error("You have already booked this service.");
    }

    const booking = await prisma.booking.create({
        data: {
            customerId,
            technicianId: service.technicianId,
            serviceId,
        },
        include: {
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    technicianProfile: {
                        select: {
                            bio: true,
                            experience: true,
                        },
                    },
                },
            },
            service: true,
        },
    });

    return booking;
};


const getMyBookingsFromDB = async (customerId: string) => {

    const bookings = await prisma.booking.findMany({
        where: {
            customerId,
        },

        orderBy: {
            createdAt: "desc",
        },

        include: {
            service: true,
            payment: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,

                    technicianProfile: {
                        select: {
                            bio: true,
                            experience: true,
                        },
                    },
                },
            },
        },
    });

    return bookings;
};


const getMySpecificBookingFromDB = async (
    customerId: string,
    bookingId: string
) => {
    const booking = await prisma.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
            customerId,
        },
        include: {
            service: true,
            payment: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    technicianProfile: {
                        select: {
                            bio: true,
                            experience: true,
                        },
                    },
                },
            },
        },
    });

    const review = await prisma.review.findFirst({
        where: {
            customerId,
            technicianId: booking.technician.id,
        },
    });

    return {
        ...booking,
        hasReviewed: !!review,
    };
};



const getTechnicianBookingsFromDB = async (technicianId: string) => {
    const bookings = await prisma.booking.findMany({
        where: {
            technicianId,
        },

        orderBy: {
            createdAt: "desc",
        },

        include: {
            payment: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            service: true,
        },
    });

    return bookings;
};


const updateBookingStatusIntoDB = async (bookingId: string, technicianId: string, status: BookingStatus) => {

    const booking = await prisma.booking.findFirstOrThrow({
        where: {
            id: bookingId,
            technicianId,
        },
    });

    const updatedBooking = await prisma.booking.update({
        where: {
            id: booking.id,
        },
        data: {
            status,
        },
        include: {
            payment: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            service: true,
        },
    });

    return updatedBooking;
};


export const bookingService = {
    createBookingIntoDB,
    getMyBookingsFromDB,
    getMySpecificBookingFromDB,

    getTechnicianBookingsFromDB,
    updateBookingStatusIntoDB
}