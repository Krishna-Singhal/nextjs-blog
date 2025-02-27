export function response(status = 200, message = "", data = {}) {
    return new Response(JSON.stringify({ message, ...data }), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
