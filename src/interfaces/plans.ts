type vip_ = 'vip';
type pro_ = 'pro';
type monthly_ = 'monthly';
type annually_ = 'annually';
export type plans_ = vip_ | pro_;
export type duration_ = monthly_ | annually_;

export interface PRO_ {
    plan: pro_,
    price: 19.9
}

export interface VIP_ {
    plan: vip_
    duration?: annually_
    price: 39.9;
}

export interface PRE_ {
    plan: vip_
    duration?: monthly_
    price: 6.9;
}