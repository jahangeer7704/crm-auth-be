import { appLogger } from "@/utils/observability/logger/appLogger.js";
import mongoose from "mongoose";
class MongooseClient {
    private static instance :MongooseClient
    private isConnected=false;
    private constructor(){}
    
}