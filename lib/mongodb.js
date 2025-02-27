import mongoose from "mongoose";
import "../models";

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the DB_URI environment variable");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("Creating new MongoDB connection");
        cached.promise = mongoose.connect(MONGODB_URI, {
            autoIndex: true,
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}

global.mongoose = cached;
