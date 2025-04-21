import fs from 'fs';
import { promisify } from 'util';
const unlinkAsync = promisify(fs.unlink);

const UnlinkAsync = async (path: string) => await unlinkAsync(path)

export default UnlinkAsync;