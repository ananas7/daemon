// Инициализация emmiter
import events from 'events';
const eventEmitter = new events.EventEmitter();
//eventEmitter.setMaxListeners(0);
let config = {
    // Настройки базы данных
    client: 'mysql',
    host: '10.0.0.1',
    user: 'root',
    password: '1234',
    database: 'test',
    charset: 'utf8',
    // Выбор порта для демона
    port: 80,
    devPort: 8080,
    // Время до которого нужно звонить
    timeTill: 20,
    // Время с которого нужно звонить
    timeFrom: 10,
    timezone: "UTC",
    userName: 'root',
    // Настройка рабочих дней
    days: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    },
    allowedWeekdays: [1, 1, 1, 1, 1, 1, 1],
    // Максимальное количество людей для обзвона
    mrcpMaxLicenses: 1,
    // Время через которое нужно перезвонить
    outboundReleaseTimeout: 60,
    // Максимальное количество перезвонов
    maxRetries: 2,
    // Имя филиала
    filialName: 'test',
    callerId: '',
    trunk: 'SIP/test',
    context: 'test',
    // Время в минутах, когда нужно перезвонить человеку, если подходит верхняя граница времени обзвона
    deadLineMinutes: 2,
    // Время в ms на проверку рабочего времени
    cooldownCheckNightTime: 10000,
    // Время в ms на повторный запуск поиска клиентов
    cooldownRefreshDaemon: 300000,
    // Время в ms на повторный запуск поиска клиентов, в случае ожидания удаления файлов
    cooldownWaitDaemon: 1000,
    // Режим работы
    mode: 'prod',
    // Статус для определения developer
    resultDeveloper: 'dev',
    systemName: 'system',
    // Максимальное количество запросов на обновления
    countQueueIndex: 3,
    eventEmitter: eventEmitter,
    // Файлы для логирования
    logDir: './logs/',
    errorFile: './logs/error.log',
    infoFile: './logs/info.log',
    verboseFile: './logs/verbose.log',
    namiConfig: {
		host: "10.0.0.1",
		port: 1111,
		username: "test",
		secret: "test",
        logger: {
            error: function(message) {},
            warn : function(message) {},
            info : function(message) {},
            debug: function(message) {},
        },
    },
    resource: 120000,
    permissionCall: false,
    debug: true
};
// Подключение к бд
const knex = require('knex')({
    client: config.client,
    connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        charset: config.charset,
        timezone: config.timezone
    }
});
// Инициализация моделей, для работы с бд
const bookshelf = require('bookshelf')(knex);
config.bookshelf = bookshelf;
config.knex = knex;
module.exports = config;
