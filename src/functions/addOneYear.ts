import { PRO_, VIP_ } from "../interfaces/plans";

type date_ = Date | undefined;
type plan_ = PRO_['plan'] | VIP_['plan'] | 'pre';

export default function addOneYear(date: date_, plan: plan_): Date {

    const DATE = (date instanceof Date)
        ? new Date(date)
        : new Date();

    const newDATE = (plan === 'pre')
        ? DATE.setMonth(DATE.getMonth() + 1)
        : DATE.setFullYear(DATE.getFullYear() + 1);

    return new Date(newDATE);
}