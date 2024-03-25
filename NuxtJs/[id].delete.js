import Customer from "../../dbModels/customer";

// DELETE A CUSTOMER
export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event);

        const customerData = await Customer.deleteOne({
            _id: id
        });
        if (customerData.deletedCount === 1) {
            return {
                code: "DELETE SUCCESS",
                message: "Customer deleted successfully"
            }
        } else {
            event.respondWith(new Response('Failed to Delete Customer', { status: 404 }));
        }
    } catch (err) {
        event.respondWith(new Response('Failed to Delete Customer', { status: 500 }));

    }
});
