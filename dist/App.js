"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const routes_1 = require("./src/routes");
const swagOptions = { explorer: false };
const swaggerDocument = yaml.load('./swagger/swagger.yaml');
if (process.env.NODE_ENV === 'production') {
    swaggerDocument.host = 'https://sandip-shopping-app.herokuapp.com';
}
else {
    swaggerDocument.host = `localhost:${process.env.PORT}`;
}
class App {
    constructor() {
        this.mongoUrl = process.env.MONGO_URL;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.express = express();
            this.httpServer = http.createServer(this.express);
            yield this.middleware();
            yield this.mongoSetup();
            this.setupRoutes();
        });
    }
    middleware() {
        return __awaiter(this, void 0, void 0, function* () {
            this.express.use(cors());
            this.express.use(bodyParser.json());
            this.express.use(bodyParser.urlencoded({ extended: true }));
            this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swagOptions));
        });
    }
    setupRoutes() {
        routes_1.registerRoutes(this.express);
    }
    mongoSetup() {
        return __awaiter(this, void 0, void 0, function* () {
            mongoose.set('debug', true);
            yield mongoose.connect(this.mongoUrl, {
                autoIndex: true,
                useNewUrlParser: true,
                useCreateIndex: true,
            });
        });
    }
}
exports.App = App;
