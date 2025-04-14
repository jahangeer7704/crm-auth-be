import type { Channel } from "amqplib";

export interface IRabbitMqClient{
    connect() : Promise<void>;
    sendToQueue(queue : string, message : string) : Promise<void>;
    consumeFromQueue(queue : string, callback : (msg :any) => void) : Promise<void>;
    getChannel():Channel
    close() : Promise<void>;
}

