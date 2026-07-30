import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createCheckoutSessionIntoStripe = async (customerId: string, bookingId: string) => {

    const booking = await prisma.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
            customerId,
            status: "Accepted",
        },
        include: {
            customer: true,
            service: true,
        },
    });

    const customer = await stripe.customers.create({
        email: booking.customer.email,
        name: booking.customer.name,
    });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: [
            {
                price_data: {

                    currency: "bdt",
                    unit_amount: Number(booking.service.price) * 100,

                    product_data: {
                        name: booking.service.title,
                        description: booking.service.description ? booking.service.description : "Description not available",
                    },
                },
                quantity: 1,

            },
        ],

        metadata: {
            name: booking.service.title,
            description: booking.service.description ? booking.service.description : "Description not available",
            bookingId: booking.id,
            customerId: booking.customerId,
        },

        success_url: `${config.app_url}/dashboard/payment?success=true`,
        cancel_url: `${config.app_url}/dashboard/payment?success=false`,
    });

    return {
        paymentUrl: session.url,
    };
};


const webhookHandler = async (payload: Buffer, signature: string) => {

    const endpointSecret = config.stripe_webhook_key;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret!
    );

    switch (event.type) {
        case "checkout.session.completed":
            await handleCheckoutCompleted(event.data.object);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
};


const getMyPaymentHistoryFromDB = async (customerId: string) => {
    const payments = await prisma.payment.findMany({
        where: {
            booking: {
                customerId
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        omit: {
            bookingId: true
        },
        include: {
            booking:
            {
                omit: {
                    technicianId: true,
                    serviceId: true
                },
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            price: true
                        }
                    },
                    technician: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    })
    return payments
}


const getMySinglePaymentFromDB = async (customerId: string, paymentId: string) => {
    const payment = await prisma.payment.findFirstOrThrow({
        where: {
            id: paymentId,
            booking: {
                customerId
            }
        },

        omit: {
            bookingId: true
        },
        include: {
            booking:
            {
                omit: {
                    technicianId: true,
                    serviceId: true
                },
                include: {
                    service: {
                        omit: {
                            technicianId: true
                        }
                    },
                    technician: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            availability: {
                                select: {
                                    workingDays: true,
                                    startTime: true,
                                    endTime: true
                                }
                            }
                        },
                    },
                },
            },
        },
    })

    return payment
}

export const paymentService = {
    createCheckoutSessionIntoStripe,
    webhookHandler,
    getMyPaymentHistoryFromDB,
    getMySinglePaymentFromDB
};