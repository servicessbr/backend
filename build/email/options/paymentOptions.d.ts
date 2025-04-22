declare function paymentOptions(to: any, original_subwork_title: any, payer_customer_name: any, not_me: any, transaction_amount: any, execution_date: any): {
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
export default paymentOptions;
