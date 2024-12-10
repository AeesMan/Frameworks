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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["audio/mpeg", "audio/wav"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed!"), false);
    }
  },
});

// Ендпоінт для завантаження треків
app.post("/uploads", upload.single("file"), async (req, res) => {
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
      filePath: req.file.path, // Шлях до файлу зберігається в базі даних
    });

    await track.save();
    res.status(200).send({ message: "File uploaded successfully", track });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send({ error: err.message });
  }
});

// Ендпоінт для отримання списку треків
app.get("/uploads", async (req, res) => {
  try {
    const tracks = await Track.find();
    // Transform tracks to include `id` (MongoDB `_id`)
    const transformedTracks = tracks.map((track) => ({
      id: track._id, // Ensure `_id` is included
      name: track.name,
      author: track.author,
      filePath: track.filePath,
      mimeType: track.mimeType, // Add this if needed
    }));
    res.status(200).send(transformedTracks);
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
    } else if (path.endsWith(".wav")) {
      res.set("Content-Type", "audio/wav");
    }
  }
}));

// Ендпоінт для видалення трека
app.delete("/uploads/:id", async (req, res) => {
  try {
    const trackId = req.params.id; // Отримуємо ID з параметрів запиту
    console.log("Deleting track with ID:", trackId); // Логування для перевірки ID

    const track = await Track.findByIdAndDelete(trackId);
    if (!track) {
      return res.status(404).send({ message: "Track not found" });
    }

    // Формуємо шлях до файлу
    const filePath = path.join(__dirname, track.filePath.replace(/\\/g, '/'));
    console.log("Attempting to delete file at:", filePath); // Логування шляху до файлу

    // Перевіряємо, чи файл існує
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully:", filePath);
        }
      });
    } else {
      console.log("File not found for deletion:", filePath);
    }

    res.status(200).send({ message: "Track deleted successfully" });
  } catch (err) {
    console.error("Error deleting track:", err);
    res.status(500).send({ error: err.message });
  }
});

// Сервер
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
