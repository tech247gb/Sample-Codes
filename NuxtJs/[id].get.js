import Customer from "../../dbModels/customer";

// GET INFO OF A SINGLE CUSTOMER

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event);
        const customerData = await Customer.findOne({
            _id: id
        });

        if (!customerData) {
            event.respondWith(new Response('Customer doesn\'t Exist', { status: 404 }));
        }

        if (customerData) {
            return customerData
        }
    } catch (err) {
        event.respondWith(new Response('Failed to get the Customer', { status: 500 }));
    }
});
