"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const logger_1 = require("./src/logger");
dotenv.config();
const App_1 = require("./App");
const PORT = Number(process.env.PORT);
const app = new App_1.App();
let server;
app
    .init()
    .then(() => {
    app.express.set('port', PORT);
    server = app.httpServer;
    server.on('error', serverError);
    server.on('listening', serverListening);
    server.listen(PORT);
})
    .catch((err) => {
    logger_1.logger.error(err.name);
    logger_1.logger.error(err.message);
    logger_1.logger.error(err.stack);
});
function serverError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    throw error;
}
function serverListening() {
    logger_1.logger.info(`Server listening on : ${PORT} and swagger /docs`);
}
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled Promise Rejection: reason:', reason.message);
    logger_1.logger.error(reason.stack);
    process.exit(1);
});
