/**
 * Created by i.lomtev on 28.02.17.
 */
import dateFormat from 'dateformat';
import config from '../config';
import logger from './logger';

const helperFunction = {
    // Форматирование времени
    dateTimeNow: () => {
        return dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    },
    dateNow: () => {
        return dateFormat(new Date(), 'isoDate')
    },
    // Поодсчёт времени +- минуты
    calcTime: (minute) => {
        let currentDateTime = new Date();
        return dateFormat(currentDateTime.setMinutes(currentDateTime.getMinutes() + minute), 'yyyy-mm-dd HH:MM:ss');
    },
    // Получить час
    timeHourse: () => {
        return (new Date()).getHours();
    },
    // Проверка рабочего времени
    checkTime: (index) => {
        let checkTime = setInterval(() => {
            const timeHourseNow = new Date().getHours();
            if (timeHourseNow >= config.timeFrom && timeHourseNow < config.timeTill) {
                index();
                logger.info('START daemon');
                clearInterval(checkTime);
            } else {
                logger.info('(-.-)Zzz..');
            }
        }, config.cooldownCheckNightTime);
    },
    // Повторный поиск клиентов, если пока нет доступных
    refreshDaemon: (index) => {
        let checkTime = setInterval(() => {
            index();
            logger.info('FIND available client');
            clearInterval(checkTime);
        }, config.cooldownRefreshDaemon);
    },
    // Получить день недели цифрой (от 0 до 6)
    getDay: () => {
        return (new Date).getDay();
    }
};

module.exports = helperFunction;