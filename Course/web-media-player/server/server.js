const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Ініціалізація додатку
const app = express();
app.use(cors());
app.use(express.json()); // Для обробки JSON
app.use(express.urlencoded({ extended: true })); // Для обробки form-urlencoded

// Перевіряємо і створюємо папку "uploads", якщо її немає
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Підключення до MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mediaCollection", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Схема та модель для зберігання треків
const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  filePath: { type: String, required: true },
});

const Track = mongoose.model("Track", trackSchema);

// Налаштування зберігання файлів (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Збереження файлів в папці "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ендпоінт для завантаження треків
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Перевірка наявності завантаженого файлу
    if (!req.file) {
      throw new Error("File not uploaded");
    }

    const { name, author } = req.body;
    const track = new Track({
      name,
      author,
      filePath: req.file.path,
    });

    await track.save();
    res.status(200).send({ message: "File uploaded successfully", track });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send({ error: err.message });
  }
});

// Ендпоінт для отримання списку треків
app.get("/tracks", async (req, res) => {
  try {
    const tracks = await Track.find();
    res.status(200).send(tracks);
  } catch (err) {
    console.error("Error fetching tracks:", err);
    res.status(500).send({ error: err.message });
  }
});

// Сервіс для статичних файлів
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    if (path.endsWith(".mp3")) {
      res.set("Content-Type", "audio/mpeg");
    }
  }
}));



// Сервер
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
