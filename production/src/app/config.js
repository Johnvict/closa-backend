"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const result = dotenv_1.default.config();
if (result.error) {
    //   throw result.error;
    console.log('FATAL ERROR: COULD NOT LOAD ENVIRONMENT VARIABLES');
    process.exit(1);
}
const { parsed: envs } = result;
module.exports = envs;
