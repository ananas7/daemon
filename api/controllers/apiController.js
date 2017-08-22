import config from '../../config';
import co from 'co';
import logger from '../../libs/logger';
import AutoinformController from '../autoinform/index';

// Контроллер для api
function Controller() {
    this.bookshelf = config.bookshelf;
    this.Applications = this.bookshelf.Model.extend({
        tableName: 'applications',
        hasTimestamps: true
    });
}

// Функция проверки формата данных
Controller.prototype.correctData = function () {
    return (this.data['value'] && this.data['token'] && this.data['type'] && this.data['action']);
};

// Обёртка результата запроса
Controller.prototype.result = function (type, message) {
    return JSON.stringify({
        'result': type,
        'data': message
    });
};

Controller.prototype.resultPromise = function (data) {
    return new Promise((resolve) => {
        resolve(data);
    })
};

Controller.prototype.index = function (data) {
    this.AutoinformController = new AutoinformController();
    this.data = data;
    // Проверка формата пришедших данных
    if (!this.correctData()) {
        return this.resultPromise(this.result(false, "'token', 'action', 'type' and 'value' is required"));
    }
    const self = this;
    return co(function *() {
        let token;
        // Поиск токена
        try {
            token = yield self.Applications.forge({'token': self.data['token']})
                .fetch();
        } catch (err) {
            logger.error(err);
        }
        // Проверка прав по токену
        if (!token) {
            console.error('error: token is', token);
            return self.result(false, "incorrect 'token'");
        }
        if (token.get('active') != 1) {
            console.error('error: "token" is not active');
            return self.result(false, "'token' is not active");
        }
        // Распределение запросов с api
        switch (self.data['type']) {
            case 'autoinform': {
                try {
                    logger.info('api autoinform');
                    return yield self.AutoinformController.index(token, self.data['action'], self.data['value']);
                } catch (err) {
                    logger.error(err);
                }
                break;
            }
            default: {
                return false;
                logger.error("correct 'type'");
                break;
            }
        }
    });
};

module.exports = Controller;
