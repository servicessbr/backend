import multer from 'multer';
const storage = multer.memoryStorage();
const uploads = multer({ storage });

const memoryStorage = {
    single: uploads.single('uploadedAvatar'),

    array: uploads.array('uploadedBanners')
}

export default memoryStorage;