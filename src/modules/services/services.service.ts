import { ServiceWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ServicePayload, ServiceQuery } from "./services.interface";

const createServiceIntoDB = async (payload: ServicePayload, technicianId: string) => {
    const { categoryId, title, description, price } = payload;

    const isCategoryExists = await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId, 
        },
    });

    if (price <= 0) {
        throw new Error("Price must be positive");
    }

    const createdService = await prisma.service.create({
        data: {
            technicianId,
            categoryId,
            title,
            description,
            price,
        },
        include: {
            technician: {
                omit: {
                    password: true
                }
            },
            category: true,
        },
    });

    return createdService
}


const getAllServicesFromDB = async (query: ServiceQuery) => {
    const { type, searchTerm } = query

    const sortBy = query.sortBy ? query.sortBy : "price";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"
    const andConditions: ServiceWhereInput[] = [];

    if (type) {
        andConditions.push({
            category: {
                title: {
                    equals: type,
                    mode: "insensitive",
                },
            },
        });
    }

    if (searchTerm) {
        andConditions.push({
            title: {
                contains: searchTerm as string,
                mode: "insensitive",
            },
        });
    }

    const result = await prisma.service.findMany({
        where: {
            AND: andConditions,
        },
        omit: {
            technicianId: true,
            categoryId: true
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            bookings: true,
            category: true,
            technician: {
                select: {
                    technicianProfile: {
                        omit: {
                            createdAt: true
                        }
                    },
                    availability: {
                        select: {
                            workingDays: true,
                            startTime: true,
                            endTime: true
                        }
                    },
                    technicianReviews: {
                        omit: {
                            technicianId: true
                        }
                    }
                }
            },
        },
    });

    return result;
};

export const servicesService = {
    createServiceIntoDB,
    getAllServicesFromDB
}