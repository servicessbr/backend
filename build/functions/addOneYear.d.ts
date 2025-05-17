import { PRO_, VIP_ } from "../interfaces/plans";
type date_ = Date | undefined;
type plan_ = PRO_['plan'] | VIP_['plan'] | 'pre';
export default function addOneYear(date: date_, plan: plan_): Date;
export {};
