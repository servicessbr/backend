"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
/*
    * Midlewares:
*/
const authorization_1 = __importDefault(require("./middlewares/auth/authorization"));
const owner_1 = __importDefault(require("./middlewares/auth/owner"));
const generateCode_1 = __importDefault(require("./middlewares/validations/generateCode"));
const codeValidation_1 = __importDefault(require("./middlewares/validations/codeValidation"));
const convertEmail_1 = __importDefault(require("./middlewares/convertEmail"));
const updatePhone_1 = __importDefault(require("./middlewares/updatePhone"));
/*
    * Images:
*/
const firebase_1 = __importDefault(require("./middlewares/firebase"));
const Sharp_1 = require("./middlewares/images/Sharp");
const memoryStorage_1 = __importDefault(require("./middlewares/images/memoryStorage"));
/*
    * Admin
*/
const adminAuthorization_1 = __importDefault(require("./Admin/adminMiddlewares/adminAuthorization"));
const adminControllers_1 = __importDefault(require("./Admin/adminControllers/adminControllers"));
/*
    * Controllers:
*/
const cardsController_1 = __importDefault(require("./controllers/cardsController"));
const usersController_1 = __importDefault(require("./controllers/usersController"));
const worksController_1 = __importDefault(require("./controllers/worksController"));
const emailController_1 = __importDefault(require("./controllers/emailController"));
const locationsController_1 = __importDefault(require("./controllers/locationsController"));
const feedbackController_1 = __importDefault(require("./controllers/feedbackController"));
const channelController_1 = __importDefault(require("./chat/channelController"));
const tmpController_1 = __importDefault(require("./controllers/tmpController"));
const pixController_1 = __importDefault(require("./controllers/pixController"));
const proController_1 = __importDefault(require("./controllers/proController"));
const end_1 = __importDefault(require("./middlewares/end"));
const paypalController_1 = __importDefault(require("./controllers/paypalController"));
const internationalsController_1 = __importDefault(require("./controllers/internationalsController"));
/*
    * Connection:
*/
require("./models/connection/connection");
const gpayStripeController_1 = __importDefault(require("./controllers/gpayStripeController"));
const isVip_1 = __importDefault(require("./middlewares/isVip"));
/*
    * Users
*/
routes.post('/users/create', codeValidation_1.default.newUser, usersController_1.default.create);
routes.post('/users/delete', authorization_1.default, usersController_1.default.delete);
routes.put('/users/login', usersController_1.default.login);
routes.delete('/users/logout', authorization_1.default, usersController_1.default.logout);
routes.get('/users/load/:uid', usersController_1.default.load);
routes.put('/users/update', authorization_1.default, usersController_1.default.update);
routes.put('/users/updates/password', codeValidation_1.default.utoken, usersController_1.default.updates.password);
routes.put('/users/updates/phone', authorization_1.default, updatePhone_1.default, end_1.default);
/*
    * Works
*/
routes.post('/works/subworks/create', authorization_1.default, updatePhone_1.default, worksController_1.default.create);
routes.put('/works/subworks/update', authorization_1.default, owner_1.default, updatePhone_1.default, worksController_1.default.update);
routes.delete('/works/delete/:work_id', authorization_1.default, worksController_1.default.delete);
routes.get('/works/subworks/load/:work_id', isVip_1.default, worksController_1.default.load);
/*
    * Cards
*/
routes.put('/cards/list', cardsController_1.default.list);
routes.get('/cards/belongs', authorization_1.default, cardsController_1.default.belongs);
routes.put('/cards/list/internationals', internationalsController_1.default.list);
/*
    * Generate Codes (Redis)
*/
routes.get('/code/generate/new/user/:email', generateCode_1.default.newUser, emailController_1.default.newUser);
routes.get('/code/generate/utoken/:email', convertEmail_1.default, generateCode_1.default.utoken, emailController_1.default.utoken);
routes.get('/code/generate/utoken', authorization_1.default, generateCode_1.default.utoken, emailController_1.default.utoken);
/*
    * Locations
*/
routes.get('/list/cities/:location', locationsController_1.default.list);
/*
    * Firebase
*/
routes.post('/firebase/avatar/update', authorization_1.default, memoryStorage_1.default.single, Sharp_1.sharpAvatar, firebase_1.default.avatar.update);
//routes.get('/firebase/avatar/delete', authorization, firebase.avatar.delete);
//routes.get('/firebase/delete/all', authorization, firebase.deleteAll);
/*
    * PRO
*/
routes.get('/is/pro', authorization_1.default, proController_1.default.isPro);
/*
    * Chat
*/
routes.post('/expo/push/token', authorization_1.default, channelController_1.default.channel);
/*
    * Feedback
*/
routes.put('/feedback', feedbackController_1.default.make);
routes.put('/feedback/manage/data', authorization_1.default, feedbackController_1.default.make);
/*
    * Admin
*/
routes.put('/admin/login', adminControllers_1.default.login);
routes.get('/admin/countdown', adminAuthorization_1.default, adminControllers_1.default.countUsers);
routes.post('/admin/users/create', adminAuthorization_1.default, adminControllers_1.default.createNewUser);
routes.post('/admin/generate/new/user/code', adminAuthorization_1.default, adminControllers_1.default.newExtendedCode);
/*
    * TMP
*/
routes.get('/tmp/list/premium', tmpController_1.default.premium);
/*
    * PIX - Mercado Pago
*/
routes.get('/pix/generate/pro/:plan', authorization_1.default, pixController_1.default.generate);
routes.post('/pix/status/pro/:user_uid', pixController_1.default.status);
/*
    * Google Play - Stripe
*/
routes.post('/create-payment-intent', gpayStripeController_1.default.intent);
routes.post('/google-pay/process', gpayStripeController_1.default.process);
routes.post('/confirm-payment', gpayStripeController_1.default.confirm);
//PayPal
routes.post('/paypal/capture', paypalController_1.default.capture);
routes.post('/paypal/create-order', authorization_1.default, paypalController_1.default.create_order);
//To Remove 
//routes.post('/pix/generate/payment', authorization, pixController.orders.generatePayment);
//routes.post('/pix/status/payment/:cache_id', pixController.orders.getStatusAndMakeOrder);
//routes.post('/paypal/generate', authorization, paypalController.orders.generatePaypal);
//routes.put('/paypal/checkout', authorization, paypalController.orders.checkoutPayPal);
exports.default = routes;
