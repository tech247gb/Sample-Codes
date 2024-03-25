import Customer from "../../dbModels/customer";

// GET ALL CUSTOMERS

export default defineEventHandler(async (event) => {
    try {
        const customerData = await Customer.find();

        if (customerData) {
            return customerData

        } else {
            event.respondWith(new Response('Customers not Found', { status: 404 }));
        }
    } catch (err) {
        event.respondWith(new Response('Failed to get Customers', { status: 500 }));

    }
});
