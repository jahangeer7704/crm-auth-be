import amqp from 'amqplib';


import type { IRabbitMqClient } from '@/domain/interfaces/IRabbitMqClient.js';

class RabbitMQClient implements IRabbitMqClient {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect() {
    try {
      this.connection = await amqp.connect(); 
      this.channel = await this.connection.createChannel();
      console.log('RabbitMQ Connected');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
    }
  }

  async sendToQueue(queue: string, message: string) {
    if (!this.channel) {
      throw new Error('No channel available');
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`Sent message to queue: ${queue}`);
  }

  async consumeFromQueue(queue: string, callback: (msg: any) => void) {
    if (!this.channel) {
      throw new Error('No channel available');
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg : any) => {
      if (msg) {
        callback(msg);
        this.channel?.ack(msg);
      }
    });
    console.log(`Consuming from queue: ${queue}`);
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    console.log('RabbitMQ connection closed');
  }
}

export const rabbitMQClient = new RabbitMQClient();
