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
                price: 19.9
            }
            break;

        case 'vip':
            r = {
                plan: 'vip',
                duration: 'annually',
                price: 39.9
            }
            break;

        case 'pre':
            r = {
                plan: 'vip',
                duration: 'monthly',
                price: 6.9
            }
            break;

        default:
            break;
    }

    return r;
}
