const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đảm bảo thư mục tồn tại
const uploadDir = "public/uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//
const upload = multer({ storage }).array("images", 10);

exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    //
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ imageUrls });
  });
};

exports.getAllImages = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Không đọc được thư mục." });
    }

    // Chỉ lọc file ảnh (jpg, jpeg, png, gif)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Trả về đường dẫn ảnh
    const imagePaths = imageFiles.map((file) => `/uploads/${file}`);
    res.json(imagePaths);
  });
};
