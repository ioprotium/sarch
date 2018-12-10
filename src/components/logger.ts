import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const timestampFormat = winston.format.timestamp({
  format: 'HH:mm:ss'
});

const printFormat = winston.format.printf(
  // do not print if we add info.level.toUpperCase(), maybe it is because the colors?
  info => `${info.timestamp} [${info.level}] ${info.message}`
);

const winstonLogger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: 'sarch-%DATE%.log',
      datePattern: 'YYMMDD',
      maxSize: '1m',
      maxFiles: '7d',
      dirname: 'logs',
      format: winston.format.combine(timestampFormat, printFormat),
      level: 'warning',
      handleExceptions: true,
      json: false,
      silent: process.env.NODE_ENV === 'test'
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      silent: process.env.NODE_ENV === 'test',
      format: winston.format.combine(
        winston.format.colorize(),
        timestampFormat,
        winston.format.simple(),
        printFormat
      )
    })
  ]
});

class SarchLogger {
  public debug(...args: any[]) {
    winstonLogger.debug(this.parseArgs(args));
  }

  public get transports() {
    return winstonLogger.transports;
  }

  public info(...args: any[]) {
    winstonLogger.info(this.parseArgs(args));
  }

  public warn(...args: any[]) {
    winstonLogger.warn(this.parseArgs(args));
  }

  public error(...args: any[]) {
    winstonLogger.error(this.parseArgs(args));
  }

  private parseArgs(data: any[]): string {
    let line = '';
    for (let i = 0; i < data.length; i++) {
      line += this.parseObject(data[i]) + ' ';
    }

    return line;
  }

  private parseObject(obj: any) {
    switch (typeof obj) {
      case 'number':
      case 'string':
        return obj;
      case 'object':
        return JSON.stringify(obj);
      default:
        return obj;
    }
  }
}
const logger = new SarchLogger();
export default logger;
