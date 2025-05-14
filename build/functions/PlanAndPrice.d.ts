import { PRE_, PRO_, VIP_ } from "../interfaces/plans";
type params_ = PRO_['plan'] | VIP_['plan'] | 'pre';
type plan_ = params_ | undefined | string;
type return_ = PRO_ | VIP_ | PRE_ | false;
export default function PlanAndPrice(plan: plan_): return_;
export {};
