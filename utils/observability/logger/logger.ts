import winston from "winston";
import { format } from 'date-fns';
import chalk from "chalk";

class LoggerFactory {
    private static instance: winston.Logger;

    private static readonly config = {
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            debug: 4
        },
        colors: {
            error: 'red',
            warn: 'yellow',
            info: 'green',
            http: 'magenta',
            debug: 'white'
        },
        serviceName: 'GATEWAY',
        styles: {
            error: chalk.bold.blackBright.bgHex('#df2935'),
            warn: chalk.bold.blackBright.bgHex('#fcff4b'),
            info: chalk.bold.blackBright.bgHex('#00f5d4'),
            http: chalk.bold.blackBright.bgHex('#5fa8d3'),
            debug: chalk.bold.blackBright.bgHex('#725ac1')
        },
        icon: {
            error: '❌',
            warn: '⚠️',
            info: '💡',
            http: '🌐',
            debug: '🐞'
        }
    };

    private static get isDevelopment() {
        return process.env.NODE_ENV === 'development';
    }

    private static get level() {
        return this.isDevelopment ? 'debug' : 'http';
    }

    private static createDevFormat() {
        return winston.format.printf((info) => {
            const timestamp = format(new Date(), 'EEEE, yyyy-MM-dd hh:mm:ss a');
            const service = `[${info.service}]`;
            const rawLevel = info[Symbol.for('level')] as string; // 'info', 'error', etc.
            const levelText = rawLevel.toUpperCase();
            const coloredTimestamp = chalk.black.bold.bgHex('#ffc8dd')(` ⏰ ${timestamp} `);
            const coloredService = chalk.black.bold.bgHex('#a2d2ff')(` 📦 ${service} `);
            const coloredLevel = LoggerFactory.getLevelColor(rawLevel, levelText);
            const colorMessage = LoggerFactory.getColorMessage(rawLevel, info.message as string);

            return `\n${coloredTimestamp} ${coloredService} ${coloredLevel} ${colorMessage}`;
        });
    }

    private static createProdFormat() {
        return winston.format.printf((info) => {
            const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const service = `[${info.service}]`;
            const level = info.level.toUpperCase();
            return `${timestamp} ${service} ${level}: ${info.message}`;
        });
    }
    private static formatLevel(level: string, levelText: string, includeIcon = true): string {
        const { styles, icon } = this.config;
        const iconChar = includeIcon ? icon[level as keyof typeof icon] || '' : '';
        const colorFn = styles[level as keyof typeof styles] || chalk.white;
        const fixedWidth = level !== 'warn' ? 8 : 9;
        levelText = levelText.padEnd(fixedWidth, ' ');
        const paddedText = ` ${iconChar} ${levelText} `
        return colorFn(paddedText);
    }

    private static getColorMessage(level: string, levelText: string) {
        return this.formatLevel(level, levelText, false);
    }

    private static getLevelColor(level: string, levelText: string) {
        return this.formatLevel(level, levelText);
    }

    private static get transports() {

        const baseTransports = [
            new winston.transports.Console({
                format: winston.format.combine(
                    this.isDevelopment ? winston.format.colorize() : winston.format.uncolorize(),
                    this.isDevelopment
                        ? this.createDevFormat()
                        : this.createProdFormat()
                )
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston.format.json()
            }),
            new winston.transports.File({
                filename: 'logs/combined.log',
                format: winston.format.json()
            })
        ];

        if (this.isDevelopment) {
            baseTransports.push(
                new winston.transports.File({
                    filename: 'logs/debug.log',
                    level: 'debug',
                    format: winston.format.json()
                })
            );
        }

        return baseTransports;
    }



    public static getInstance(): winston.Logger {
        if (!LoggerFactory.instance) {
            winston.addColors(this.config.colors);

            LoggerFactory.instance = winston.createLogger({
                level: this.level,
                levels: this.config.levels,
                transports: this.transports,
                handleExceptions: true,
                handleRejections: true,
                defaultMeta: { service: this.config.serviceName },
            });
        }

        return LoggerFactory.instance;
    }
}

const logger = LoggerFactory.getInstance();
// logger.stream = {
//   write: (message: string) => logger.http(message.trim())
// };

export default logger;