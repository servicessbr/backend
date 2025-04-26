import isLocalEnv from "../../functions/isLocalEnv";
import {log} from 'console';

export const URL_HEROKU_SERVER = 'https://servicess-04d4b6080f33.herokuapp.com';

export const URL_MERCADO_PAGO = "https://api.mercadopago.com";

export const URL_REACT_CLIENT = !isLocalEnv()
    ? 'https://servicess.com.br'
    : 'http://localhost:3000';


export const URL_PAYPAL_BASE = !isLocalEnv()
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';



log('2)', URL_REACT_CLIENT, URL_PAYPAL_BASE);