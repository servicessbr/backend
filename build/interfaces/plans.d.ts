import { PRE_PAYMENT, PRO_PAYEMNT, VIP_PAYMENT } from "../configs/constants/priceTag";
type vip_ = 'vip';
type pro_ = 'pro';
type monthly_ = 'monthly';
type annually_ = 'annually';
export type plans_ = vip_ | pro_;
export type duration_ = monthly_ | annually_;
export interface PRO_ {
    plan: pro_;
    price: typeof PRO_PAYEMNT;
}
export interface VIP_ {
    plan: vip_;
    duration?: annually_;
    price: typeof VIP_PAYMENT;
}
export interface PRE_ {
    plan: vip_;
    duration?: monthly_;
    price: typeof PRE_PAYMENT;
}
export {};
