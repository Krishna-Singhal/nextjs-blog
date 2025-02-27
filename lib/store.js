import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import Cookies from "cookies-next";
import CookieStorage from "redux-persist-cookie-storage";

const cookies = new Cookies();

const persistConfig = {
    key: "root",
    storage: new CookieStorage({ cookies }),
    whitelist: ["user"],
};

const rootReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer),
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
