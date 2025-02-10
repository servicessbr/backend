const express = require('express');
const routes = express.Router();

/*
    * Midlewares:
*/
const authorization = require('./middlewares/auth/authorization');
const owner = require('./middlewares/auth/owner');
const generateCode = require('./middlewares/validations/generateCode');
const codeValidation = require('./middlewares/validations/codeValidation');

/*
    * Images:
*/
const firebase = require('./middlewares/firebase');
const {
    sharpAvatar
} = require('./middlewares/images/Sharp');
const memoryStorage = require('./middlewares/images/memoryStorage');

/*
    * Helpers
*/
const convertEmail = require('./helpers/convertEmail');

/*
    * Admin
*/
const adminAuthorization = require('./Admin/adminMiddlewares/adminAuthorization');
const adminControllers = require('./Admin/adminControllers/adminControllers');

/*
    * Controllers:
*/
const cardsController = require('./controllers/cardsController');
const usersController = require('./controllers/usersController');
const worksController = require('./controllers/worksController');
const emailController = require('./controllers/emailController');
const locationsController = require('./controllers/locationsController');
const feedbackController = require('./controllers/feedbackController');
const channelController = require('./chat/channelController');
const tmpController = require('./controllers/tmpController');
const pixController = require('./controllers/pixController.js');
const ordersController = require('./controllers/ordersController.js');
const evaluationsController = require('./controllers/evaluationsController.js');


/*
    * Connection:
*/
require('./models/connection/connection.js');

/*
    * Users 
*/
routes.post('/users/create', codeValidation.newUser, usersController.create);
routes.put('/users/update', authorization, usersController.update);
routes.post('/users/delete', authorization, usersController.delete);
routes.put('/users/login', usersController.login);
routes.delete('/users/logout', authorization, usersController.logout);
routes.get('/users/load/:uid', usersController.load);
routes.put('/users/updates/password', codeValidation.utoken, usersController.updates.password);

/*
    * Works 
*/
routes.post('/works/subworks/create', authorization, worksController.create);
routes.put('/works/subworks/update/:work_id', authorization, owner, worksController.update);
routes.delete('/works/delete/:work_id', authorization, worksController.delete);
routes.get('/works/subworks/load/:work_id', worksController.load);

/*
    * Cards 
*/
routes.put('/cards/list', cardsController.list);
routes.get('/cards/belongs', authorization, cardsController.belongs);

/*
    * Generate Codes (Redis)
*/
routes.get('/code/generate/new/user/:email', generateCode.newUser, emailController.newUser);
routes.get('/code/generate/utoken/:email', convertEmail, generateCode.utoken, emailController.utoken);
routes.get('/code/generate/utoken', authorization, generateCode.utoken, emailController.utoken);

/*
    * Locations 
*/
routes.get('/list/cities/:location', locationsController.list);

/*
    * Firebase 
*/
routes.post('/firebase/avatar/update', authorization, memoryStorage.single, sharpAvatar, firebase.avatar.update);
routes.get('/firebase/avatar/delete', authorization, firebase.avatar.delete);
routes.get('/firebase/delete/all', authorization, firebase.deleteAll);

/*
    * Orders
*/
routes.get('/orders/list', authorization, ordersController.list);
routes.put('/orders/finalize/evaluate/:order_id', authorization, ordersController.finalizeAndEvaluate);

/*
    * Evaluations
*/
routes.get('/evaluations/list/:provider_professional_uid', evaluationsController.list)

/*
    * PIX
*/
routes.post('/pix/generate/payment', authorization, pixController.generatePayment);
routes.post('/pix/status/make/:cache_id', pixController.getStatusAndMakeOrder);

/*
    * Chat 
*/
routes.post('/expo/push/token', authorization, channelController.channel);

/* 
    * Feedback 
*/
routes.put('/feedback', feedbackController.make);
routes.put('/feedback/manage/data', authorization, feedbackController.make);

/*
    * Admin 
*/
routes.put('/admin/login', adminControllers.login);
routes.get('/admin/countdown', adminAuthorization, adminControllers.countUsers);
routes.post('/admin/users/create', adminAuthorization, adminControllers.createNewUser);
routes.post('/admin/generate/new/user/code', adminAuthorization, adminControllers.newExtendedCode);

/*
     * TMP
*/
routes.get('/tmp/list/premium', tmpController.premium);

module.exports = routes;
