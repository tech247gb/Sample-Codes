import Customer from "../../dbModels/customer";

// ADD NEW CUSTOMER

export default defineEventHandler(async (event) => {
    const { email, name } = await readBody(event);
    try {
        const customerData = await Customer.findOne({
            email,
        });
        if (customerData) {
            console.log(`Customer with email ${email} already exists`);
            event.respondWith(new Response(`Customer with this email already exists`, { status: 409 }));
        } else {
            if (!email || !name) {
                event.respondWith(new Response('Missing email or name', { status: 500 }));
            }
            const newCustomerData = await Customer.create({
                email,
                name,
            });
            return {
                id: newCustomerData._id,
                name: newCustomerData.name,
            };
        }
    } catch (err) {
        event.respondWith(new Response('Failed to add Customer', { status: 500 }));
    }
});
