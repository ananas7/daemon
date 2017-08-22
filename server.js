import express from 'express';
import path from 'path';
const app = express();
import cors from 'cors';
import { Nami} from  'nami';
const server = require('http').createServer(app);
const io = require('socket.io')(server);
import bodyParser from 'body-parser';
import config from './config';
import Controller from './api/controllers/apiController';
const myController = new Controller();
import co from 'co';
import DbMethods from './libs/dbMethods';

// Инициализация NAMI
const nami = new Nami(config.namiConfig);
if (!config.debug) {
    process.on('SIGINT', function () {
        nami.close();
        process.exit();
    });
    nami.open();
}
// Первый запуск поиска клиентов и создания файлов для обзвона
const daemon = new DbMethods(nami);
// Слушатель повторного запуска поиска и создания файлов на обзвон
config.eventEmitter.on('refreshDaemon', () => {
    daemon.index();
});
// Выключение CORS
app.use(cors());
// Настройки post параметров
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1024kb',
    parameterLimit: 100000
}));
app.use(bodyParser.json({limit: '1024kb'}));

// API
app.post('/api', (req, res) => {
    console.log('connect api');
    // Обращение к контроллеру, для распределения методов и назначения
    co(function*() {
        // Ответ от api передаётся сюда, для передачи клиенту
        res.end(yield myController.index(req.body));
    });
});

// Socket.io
io.on('connection', function (client) {
    logger.info('create socket connection');
    config.eventEmitter.on('reportDataClient', (data) => {
        client.emit('reportDataClient', data);
    });
    config.eventEmitter.on('addCallServer', (data) => {
        client.emit('addCallClient', data);
    });
    config.eventEmitter.on('deleteCallServer', (data) => {
        client.emit('deleteCallClient', data);
    });
});
server.listen(config.devPort, () => {
    console.log(`Start daemon auto_calls on ${config.devPort}`);
});
