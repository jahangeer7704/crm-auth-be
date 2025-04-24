import amqp from 'amqplib';
import type { ChannelModel, Channel, Message  } from "amqplib"
import { appLogger } from '@/shared/observability/logger/appLogger.js';
import { appConfig } from '@/config/readers/appConfig.js';
import type { IRabbitMqClient } from '@/domain/interfaces/IRabbitMqClient.js';

class RabbitMQClient implements IRabbitMqClient{
    private static instance: RabbitMQClient;
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;
    private isConnected = false;

    private constructor() {}

    public static getInstance(): RabbitMQClient {
        if (!RabbitMQClient.instance) {
            RabbitMQClient.instance = new RabbitMQClient();
        }
        return RabbitMQClient.instance;
    }

    public async connect() {
        if (this.isConnected) return;

        try {
            this.connection = await amqp.connect(appConfig.mq.rabbitUri);
            this.channel = await this.connection.createChannel();

            this.connection.on("error", (err) => {
                appLogger.error("rabbitmq", `Connection error: ${err.message}`);
            });

            this.connection.on("close", () => {
                appLogger.error("rabbitmq", "Connection closed.");
                this.isConnected = false;
            });

            this.isConnected = true;
            appLogger.info("rabbitmq", "RabbitMQ connected successfully.");
        } catch (error: any) {
            appLogger.error("rabbitmq", `Connection failed: ${error.message}`);
            throw error;
        }
    }

    public getChannel() {
        if (!this.channel) throw new Error("Channel not initialized.");
        return this.channel;
    }

    public async sendToQueue(queue: string, message: string): Promise<void> {
        try {
            await this.channel?.assertQueue(queue, { durable: true });
            this.channel?.sendToQueue(queue, Buffer.from(message), { persistent: true });
            appLogger.info("rabbitmq", `Message sent to queue: ${queue}`);
        } catch (error: any) {
            appLogger.error("rabbitmq", `Failed to send message to queue: ${queue}`);
        }
    }

    public async consumeFromQueue(queue: string, callback: (msg: Message) => void) {
        try {
            await this.channel?.assertQueue(queue, { durable: true });
            this.channel?.consume(queue, (msg) => {
                if (msg) {
                    callback(msg);
                    this.channel?.ack(msg);
                }
            });
            appLogger.info("rabbitmq", `Consuming from queue: ${queue}`);
        } catch (error: any) {
            appLogger.error("rabbitmq", `Failed to consume from queue: ${queue}`);
        }
    }

    public async close(){
        try {
            await this.channel?.close();
            await this.connection?.close();
            appLogger.info("rabbitmq", "RabbitMQ connection closed.");
        } catch (error: any) {
            appLogger.error("rabbitmq", `Error closing connection: ${error.message}`);
        }
    }
}

export const rabbitMQClient = RabbitMQClient.getInstance();
