"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonService = void 0;
const randombytes_1 = __importDefault(require("randombytes"));
class CommonService {
    constructor() {
        this.generateRandom = (length) => {
            const numbers = '0123456789';
            let result = '';
            for (var i = length; i > 0; --i) {
                result += numbers[Math.round(Math.random() * (numbers.length - 1))];
            }
            return result;
        };
        this.generateRandomBytes = (bytes = 12) => {
            return new Promise((resolve, reject) => {
                try {
                    randombytes_1.default(bytes, (err, buffer) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            resolve(buffer.toString('hex'));
                        }
                    });
                }
                catch (err) {
                    reject(err);
                }
            });
        };
    }
}
exports.commonService = new CommonService();
//# sourceMappingURL=common.service.js.map