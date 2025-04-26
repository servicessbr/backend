import express from 'express';
const routes = express.Router();

/*
    * Midlewares:
*/
import authorization from './middlewares/auth/authorization';
import owner from './middlewares/auth/owner';
import generateCode from './middlewares/validations/generateCode';
import codeValidation from './middlewares/validations/codeValidation';
import convertEmail from './middlewares/convertEmail';
import updatePhone from './middlewares/updatePhone';

/*
    * Images:
*/
import firebase from './middlewares/firebase';
import { sharpAvatar } from './middlewares/images/Sharp';
import memoryStorage from './middlewares/images/memoryStorage';

/*
    * Admin
*/
import adminAuthorization from './Admin/adminMiddlewares/adminAuthorization';
import adminControllers from './Admin/adminControllers/adminControllers';

/*
    * Controllers:
*/
import cardsController from './controllers/cardsController';
import usersController from './controllers/usersController';
import worksController from './controllers/worksController';
import emailController from './controllers/emailController';
import locationsController from './controllers/locationsController';
import feedbackController from './controllers/feedbackController';
import channelController from './chat/channelController';
import tmpController from './controllers/tmpController';
import pixController from './controllers/pixController';
import ordersController from './controllers/ordersController';
import evaluationsController from './controllers/evaluationsController';
import proController from './controllers/proController';
import end from './middlewares/end';
import paypalController from './controllers/paypalController';
import internationalsController from './controllers/internationalsController';

/*
    * Connection:
*/
import './models/connection/connection';

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
routes.put('/cards/list/internationals', internationalsController.list);

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
routes.post('/paypal/generate', authorization, paypalController.orders.generatePaypal);
routes.put('/paypal/checkout', authorization, paypalController.orders.checkoutPayPal);
/*
    * PIX - PRO
*/
routes.get('/pix/generate/pro', authorization, pixController.pro.generate);
routes.post('/pix/status/pro/:user_uid', pixController.pro.status);
/*
    * PayPal - PRO
*/
routes.get('/paypal/generate/pro', authorization, paypalController.pro.generatePp);
routes.put('/paypal/checkout/pro', authorization, paypalController.pro.checkoutPp);

export default routes;
