import multer from 'multer';

// export interface CustomFile extends Express.Multer.File[] {
//     buffer: Buffer;
// }

const storage = multer.memoryStorage();
export const upload = multer({storage: storage});

// Middleware validation với TypeScript
// export const fileValidation = (req: Request<{}, {}, CreateProductRequest>, res: Response, next: NextFunction) => {
//     const body = req.body;
//
//     const images = body.images;
//
//     // Kiểm tra nếu file không tồn tại
//     if (!images) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }
//
//
//     // Giới hạn kích thước file (ví dụ: tối đa 2MB)
//     const maxSize = 2 * 1024 * 1024; // 2MB
//     for (const file of images) {
//         if (file.size > maxSize) {
//             return res.status(400).json({ message: "File is too large (max 2MB)" });
//         }
//     }
//
//     // Nếu tất cả đều hợp lệ, tiếp tục
//     next();
// };