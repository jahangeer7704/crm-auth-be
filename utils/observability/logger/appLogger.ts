import Logger from "./logger.js";
class AppLogger {
  private static instance:AppLogger;
  private formatMessage(service: string, emoji: string, msg: string) {
    return `${emoji} [${service.toUpperCase()}] ${msg}`;
  }

  public info(service: string, msg: string) {
    Logger.info(this.formatMessage(service, '🚀', msg));
  }

  public error(service: string, msg: string) {
    Logger.error(this.formatMessage(service, '❌', msg));
  }

  public warn(service: string, msg: string) {
    Logger.warn(this.formatMessage(service, '⚠️', msg));
  }

  public debug(service: string, msg: string) {
    Logger.debug(this.formatMessage(service, '🐞', msg));
  }
private constructor(){}
public static getInstance(){
  if(!AppLogger.instance){
    AppLogger.instance= new AppLogger()
  }
  return AppLogger.instance;
}

}

export const appLogger = AppLogger.getInstance()