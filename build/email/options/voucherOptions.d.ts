declare function voucherOptions(to: any, operation_number: any, user_uid: any, date_approved: any, transaction_amount: any, user_name: any): {
    from: string;
    to: any;
    subject: string;
    html: string;
    attachments: {
        filename: string;
        path: string;
        cid: string;
    }[];
};
export default voucherOptions;
