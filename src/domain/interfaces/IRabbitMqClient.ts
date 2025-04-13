export interface IRabbitMqClient{
    connect() : Promise<void>;
    sendToQueue(queue : string, message : string) : Promise<void>;
    consumeFromQueue(queue : string, callback : string) : Promise<void>;
    close() : Promise<void>;
}

