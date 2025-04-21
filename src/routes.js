const express = require('express');
const routes = express.Router();

/*
    * Midlewares:
*/
const authorization = require('./middlewares/auth/authorization');
const owner = require('./middlewares/auth/owner');
const generateCode = require('./middlewares/validations/generateCode');
const codeValidation = require('./middlewares/validations/codeValidation');
const convertEmail = require('./middlewares/convertEmail');
const updatePhone = require('./middlewares/updatePhone');

/*
    * Images:
*/
const firebase = require('./middlewares/firebase');
const {
    sharpAvatar
} = require('./middlewares/images/Sharp');
const memoryStorage = require('./middlewares/images/memoryStorage');

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
const pixController = require('./controllers/pixController');
const ordersController = require('./controllers/ordersController');
const evaluationsController = require('./controllers/evaluationsController');
const proController = require('./controllers/proController');
const end = require('./middlewares/end');
const paypalController = require('./controllers/paypalController');

/*
    * Connection:
*/
require('./models/connection/connection');

/*
    * Users 
*/
routes.post('/users/create', codeValidation.newUser, usersController.create);
routes.post('/users/delete', authorization, usersController.delete);
routes.put('/users/login', usersController.login);
routes.delete('/users/logout', authorization, usersController.logout);
routes.get('/users/load/:uid', usersController.load);
routes.put('/users/update', authorization, usersController.update);
routes.put('/users/updates/password', codeValidation.utoken, usersController.updates.password);
routes.put('/users/updates/phone', authorization, updatePhone, end);

/*
    * Works 
*/
routes.post('/works/subworks/create', authorization, updatePhone, worksController.create);
routes.put('/works/subworks/update', authorization, owner, updatePhone, worksController.update);
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
//routes.get('/firebase/avatar/delete', authorization, firebase.avatar.delete);
//routes.get('/firebase/delete/all', authorization, firebase.deleteAll);

/*
    * Orders 
*/
routes.get('/orders/list', authorization, ordersController.list);
routes.put('/orders/finalize/evaluate/:order_id', authorization, ordersController.finalizeAndEvaluate);

/*
    * Evaluations
*/
routes.get('/evaluations/list/:provider_professional_uid', evaluationsController.list);

/*
    * PRO
*/
routes.get('/is/pro', authorization, proController.isPro);

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


/*
    * Payment Methods
*/
/*
    * PIX - Orders
*/
routes.post('/pix/generate/payment', authorization, pixController.orders.generatePayment);
routes.post('/pix/status/payment/:cache_id', pixController.orders.getStatusAndMakeOrder);
/*
     * PayPal - Orders
*/
routes.post('/paypal/generate', authorization, paypalController.generatePaypal);
routes.put('/paypal/checkout', authorization, paypalController.checkoutPayPal);
/*
    * PIX - PRO
*/
routes.get('/pix/generate/pro', authorization, pixController.pro.generate);
routes.post('/pix/status/pro/:user_uid', pixController.pro.status);



export default routes;
