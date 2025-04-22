declare function emailOptions(code: string, to: string): {
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
export default emailOptions;
