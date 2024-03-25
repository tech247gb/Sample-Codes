import Customer from "../../dbModels/customer";

// UPDATE A CUSTOMER DETAILS

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event);
        const { email, name } = await readBody(event);

        let updateBody = {};

        if (!email && !name) {
            event.respondWith(new Response('Update Text Missing', { status: 404 }));
        }
        if (name !== null || name !== undefined) {
            updateBody.name = name;

        }
        if (email !== null || email !== undefined) {
            updateBody.email = email;

        }

        const customerData = await Customer.findOneAndUpdate({
            _id: id
        }, updateBody, { new: true });

        if (!customerData) {
            event.respondWith(new Response('Customer Not Found', { status: 404 }));
        }
        return {
            message: "Updated Successfully",
            data: customerData
        }
    } catch (err) {
        event.respondWith(new Response('Failed to update Customer', { status: 500 }));

    }
});
