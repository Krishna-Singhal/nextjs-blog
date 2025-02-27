export function applyMiddlewares(...middlewares) {
    return function (handler) {
        return async function (req) {
            for (const middleware of middlewares) {
                const response = await middleware(req);
                if (response) return response;
            }
            return handler(req);
        };
    };
}
