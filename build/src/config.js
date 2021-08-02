"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = Object.freeze({
    PORT: process.env.PORT,
    MONGO_URL: 'mongodb://naveen:naveen@jamstack-shard-00-00.kzygt.mongodb.net:27017,jamstack-shard-00-01.kzygt.mongodb.net:27017,jamstack-shard-00-02.kzygt.mongodb.net:27017/jamstack_ecommerce?ssl=true&replicaSet=atlas-710f2x-shard-0&authSource=admin&retryWrites=true&w=majority',
    ADMIN_JWT_SECRET: 'sdtcb',
    USER_JWT_SECRET: 'bctds',
    FRONT_END_URL: process.env.FE_URL,
    SEND_GRID_API_KEY: "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",
    SERVICE_PORVIDER: "SendGrid",
    SENDER_EMAIL: "naveenkumarkoppala1@gmail.com"
});
//# sourceMappingURL=config.js.map