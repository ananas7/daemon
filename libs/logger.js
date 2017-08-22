/**
 * Created by i.lomtev on 27.04.17.
 */
import winston from 'winston';
import config from '../config';
import fs from 'fs';

if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir);
}

export default new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: config.infoFile,
            level: 'info',
            timestamp: true,
            colorize: true
        }),
        new (winston.transports.Console)({
            name: 'info-console',
            level: 'info',
            colorize: true
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: config.errorFile,
            level: 'error',
            timestamp: true,
            colorize: true
        }),
        new (winston.transports.Console)({
            name: 'error-console',
            level: 'error',
            colorize: true
        }),
        new (winston.transports.File)({
            name: 'verbose-file',
            filename: config.verboseFile,
            level: 'verbose',
            timestamp: true,
            colorize: true
        })
    ]
});