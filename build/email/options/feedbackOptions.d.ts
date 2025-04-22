declare function feedbackOptions(code: any, suggestion: any, uid: any, name: any, email: any, phone: any): {
    from: string;
    to: string;
    subject: string;
    html: string;
    attachments: {
        filename: string;
        path: string;
        cid: string;
    }[];
};
export default feedbackOptions;
