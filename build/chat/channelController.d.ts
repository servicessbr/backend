import { Request, Response } from 'express';
declare const channelController: {
    channel(req: Request, res: Response): Promise<void>;
};
export default channelController;
