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
const crypto = require("crypto");
class Utils {
    getPaginateResponse(response) {
        return {
            total: response.total,
            limit: response.limit,
            page: response.page,
            pages: response.pages,
        };
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.generateRandomBytes();
            return buffer.toString('hex');
        });
    }
    generateRandomBytes() {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.randomBytes(16);
        });
    }
}
exports.Utils = Utils;
