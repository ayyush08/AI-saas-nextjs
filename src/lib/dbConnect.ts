import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};


async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = dbConnection.connections[0].readyState;
        
        console.log("Ready  state: ", connection.isConnected);
        console.log("Connected to database Successfully");
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1); //graacefully exit the process
    }
}

export default dbConnect