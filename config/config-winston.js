var winstonDailyRotateFile = require('winston-daily-rotate-file');

/**
 * winston configure
 * @type {{configure: module.exports.configure}}
 */

module.exports = {
  /**
   * Configure winston
   * @param app
   * @param winston
   */
  configure: function (app, winston) {

    var transportLogDaily = new (winston.transports.DailyRotateFile)({
      filename: __dirname + '/../logs/zabava-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    });

    transportLogDaily.on('rotate', function (oldFilename, newFilename) {
      // do something fun
    });

    const { createLogger, format, transports } = winston;
    const { combine, timestamp, label, printf, prettyPrint } = format;

    const logFormat = printf(info => {
      return `${info.timestamp} ` +
        //`[${info.label}] ` +
        `${info.level}: ${info.message}`;
    });

    // Configure logging
    const logger = createLogger({
      level: 'info',
      format: winston.format.combine(
        //winston.format.json(),
        label({ label: module.filename }),
        timestamp(),
        prettyPrint()
      ),
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({ filename: __dirname + '/../logs/error.log', level: 'error' }),
        new transports.File({ filename: __dirname + '/../logs/combined.log' }),
        transportLogDaily
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.add(new winston.transports.Console({

        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          label({ label: module.filename }),
          timestamp(),
          logFormat
        )
      }));
    }
    return logger;
  }
}