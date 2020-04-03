import { ChatController } from './../controllers/chatController'
import { UserController } from './../controllers/userController'
import { UserModel } from "./../models/user";
import { ChatModel } from './../models/chat'
import { GroupChatModel } from './../models/group-chat'
import { Authorization } from './../middleware/authorization'
import { Validator } from './../middleware/validator'

/** 
 * ! Controllers import for export */
export const chatCtrl = new ChatController();
export const userCtrl = new UserController();

/**
 * ! Model import for exports */
export const userModel = new UserModel();
export const chatModel = new ChatModel();
export const groupChatModel = new GroupChatModel();

/** 
 * ! Middleware exports */
export const auth = new Authorization();
export const validator = new Validator();

/** 
 * ! Standalone methods */
export const formatError = validator.formatError;