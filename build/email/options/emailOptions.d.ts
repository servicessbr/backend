declare function emailOptions(code: any, to: any): {
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
export default emailOptions;
