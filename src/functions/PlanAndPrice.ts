import { PRE_PAYMENT, PRO_PAYEMNT, VIP_PAYMENT } from "../configs/constants/priceTag";
import { PRE_, PRO_, VIP_ } from "../interfaces/plans";

type params_ = PRO_['plan'] | VIP_['plan'] | 'pre';

type plan_ = params_ | undefined | string;

type return_ = PRO_ | VIP_ | PRE_ | false;

export default function PlanAndPrice(plan: plan_): return_ {

    let r: return_ = false;

    switch (plan) {
        case 'pro':
            r = {
                plan: 'pro',
                price: PRO_PAYEMNT
            }
            break;

        case 'vip':
            r = {
                plan: 'vip',
                duration: 'annually',
                price: VIP_PAYMENT
            }
            break;

        case 'pre':
            r = {
                plan: 'vip',
                duration: 'monthly',
                price: PRE_PAYMENT
            }
            break;

        default:
            break;
    }

    return r;
}
