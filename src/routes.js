const express = require('express');
const routes = express.Router();

//Controllers:
const cardsController = require('./controllers/cardsController');
const usersController = require('./controllers/usersController');
const worksController = require('./controllers/worksController');
const emailController = require('./controllers/emailController');
const locationsController = require('./controllers/locationsController');
const premiumController = require('./controllers/premiumController');
const MixedController = require('./controllers/MixedController');
const feedbackController = require('./controllers/feedbackController');
const pixController = require('./controllers/pixController');
const channelController = require('./chat/controllers/channelController');
const serviceOrdersController = require('./controllers/serviceOrdersController')

//Midlewares:
const authorization = require('./middlewares/authorization');
const generateCode = require('./middlewares/validations/generateCode');
const codeValidation = require('./middlewares/validations/codeValidation');

//Images:
const firebase = require('./middlewares/firebase');
const {
    sharpAvatar,
    sharpBanners
} = require('./middlewares/images/Sharp');
const memoryStorage = require('./middlewares/images/memoryStorage');

//Helpers
const convertEmail = require('./helpers/convertEmail');
const getEmail = require('./helpers/getEmail');
const sendStatus = require('./helpers/sendStatus');

//Admin
const adminAuthorization = require('./Admin/adminMiddlewares/adminAuthorization');
const adminControllers = require('./Admin/adminControllers/adminControllers');
const adminFirebase = require('./Admin/adminMiddlewares/adminFirebase');

//Connection:
require('./database/connection');
const verificationsController = require('./controllers/verificationsController');

/* Users */
routes.post('/users/create', codeValidation.newUser, usersController.create);
routes.put('/users/update', authorization, usersController.update);
routes.post('/users/delete', authorization, usersController.delete);
routes.put('/users/login', usersController.login);
routes.delete('/users/logout', authorization, usersController.logout);
routes.get('/users/load/:uid', usersController.load);
routes.put('/users/updates/password', codeValidation.utoken, usersController.updates.password);
routes.put('/users/updates/phone', authorization, usersController.updates.phone);
routes.post('/users/verify/profile', authorization,);
routes.get('/users/list/partner', usersController.partner)

/* Works */
routes.post('/works/create', authorization, MixedController.middleware, worksController.create);
routes.put('/works/update', authorization, worksController.update);
routes.delete('/works/delete/:work_id', authorization, worksController.delete);
routes.get('/works/load/:work_id', worksController.load);
routes.get('/works/limit', authorization, MixedController.middleware, sendStatus);

/* Cards */
routes.get('/cards/list/composed', cardsController.list.composed);
routes.get('/cards/list/premium', cardsController.list.premium);
routes.get('/cards/list/see/more', cardsController.list.seeMore);
routes.get('/cards/belongs/:uid', cardsController.belongs);

/* Generate Codes (Redis)*/
routes.get('/code/generate/new/user/:email', generateCode.newUser, emailController.newUser);
routes.get('/code/generate/utoken/:email', convertEmail, generateCode.utoken, emailController.utoken);
routes.get('/code/generate/utoken', authorization, generateCode.utoken, emailController.utoken);

/* Send E-mail */
routes.post('/send/message', getEmail, emailController.message);

/* Locations */
routes.get('/list/cities/:location', locationsController.list);

/* Firebase */
routes.post('/firebase/banners/update', authorization, memoryStorage.array, sharpBanners, firebase.banners.update);
routes.post('/firebase/banners/delete', authorization, firebase.banners.deleteWork);
routes.post('/firebase/avatar/update', authorization, memoryStorage.single, sharpAvatar, firebase.avatar.update);
routes.get('/firebase/avatar/delete', authorization, firebase.avatar.delete);
routes.get('/firebase/delete/all', authorization, firebase.deleteAll);

/* Premium */
routes.get('/premium/is/active/:uid', premiumController.isActive);
// PIX - PREMIUM:
routes.post('/pix/generate/payment/premium', authorization, pixController.premium.generatePayment);
routes.post('/pix/make/premium/status/:user_uid', pixController.premium.statusAndMakePremium);

/* Service Orders */
routes.post('/service/orders/intention', authorization, serviceOrdersController.intention);
routes.post('/service/orders/response', authorization, serviceOrdersController.response);
routes.get('/service/orders/list/intentions', authorization, serviceOrdersController.list.intentions);
routes.get('/service/orders/list/responses', authorization, serviceOrdersController.list.responses);
routes.get('/service/orders/validation', serviceOrdersController.validation)
// PIX - SERVICE ORDER:
routes.post('/pix/generate/payment/so', authorization, pixController.serviceOrder.generatePayment);
routes.post('/pix/generate/so/status/:so_unique_id', pixController.serviceOrder.statusAndGenerateSO);

/* Verifications */
routes.post('/verifications/create', authorization, verificationsController.create);

/* Mixed */
routes.get('/mixed/works/limit/:uid', authorization, MixedController.limit);
routes.get('/mixed/verified/:uid', authorization, MixedController.verified);

/* Chat */
routes.post('/expo/push/token', authorization, channelController.channel);

/* Feedback */
routes.put('/feedback', feedbackController.make);
routes.put('/feedback/manage/data', authorization, feedbackController.make);

/* Admin */
routes.put('/admin/login', adminControllers.login);
routes.get('/admin/countdown', adminAuthorization, adminControllers.countdown);
routes.post('/admin/users/create', adminAuthorization, adminControllers.createNewUser);
routes.get('/admin/verified/custom/token', adminAuthorization, adminFirebase.verified.getCustomToken);
routes.get('/admin/verified/list', adminAuthorization, adminControllers.verified.list);
routes.post('/admin/verified/make', adminAuthorization, adminControllers.verified.make);
routes.post('/admin/make/premium', adminAuthorization, worksController.premium);
routes.post('/admin/generate/new/user/code', adminAuthorization, adminControllers.newExtendedCode);
routes.get('/admin/so/list/mongo', adminControllers.listServiceOrderMongoDB);
routes.put('/admin/so/mark', adminControllers.markSOMongo);

// Rset heroku v7

module.exports = routes; 
