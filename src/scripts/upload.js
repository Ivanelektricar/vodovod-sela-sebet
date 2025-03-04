import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const galleryDir = path.join(projectRoot, 'gallery');
const uploadsDir = path.join(galleryDir, 'uploads');

// Ensure gallery and uploads directories exist
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
  console.log('Created gallery directory');
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const app = express();
const port = 3000;

// Serve static files from the gallery directory
app.use('/gallery', express.static(galleryDir));

// Serve the upload form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="sr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Водовод Шебет - Отпремање фотографија</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f0f9ff;
        }
        h1 {
          color: #2563eb;
          text-align: center;
        }
        form {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }
        input[type="text"], input[type="file"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #1d4ed8;
        }
        .gallery {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }
        .gallery-item {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .gallery-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .gallery-item .caption {
          padding: 10px;
          background-color: white;
        }
      </style>
    </head>
    <body>
      <h1>Отпремање фотографија за галерију водовода</h1>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <label for="caption">Опис фотографије:</label>
        <input type="text" id="caption" name="caption" required>
        
        <label for="location">Локација:</label>
        <input type="text" id="location" name="location" required>
        
        <label for="photo">Изаберите фотографију:</label>
        <input type="file" id="photo" name="photo" accept="image/*" required>
        
        <button type="submit">Отпреми фотографију</button>
      </form>
      
      <div class="gallery">
        ${getGalleryItems()}
      </div>
    </body>
    </html>
  `);
});

// Handle file upload
app.post('/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    
    // Save metadata to a JSON file
    const metadata = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      caption: req.body.caption || '',
      location: req.body.location || '',
      uploadDate: new Date().toISOString()
    };
    
    // Read existing metadata or create new array
    let allMetadata = [];
    const metadataPath = path.join(galleryDir, 'metadata.json');
    
    if (fs.existsSync(metadataPath)) {
      const data = fs.readFileSync(metadataPath, 'utf8');
      allMetadata = JSON.parse(data);
    }
    
    // Add new metadata and save
    allMetadata.push(metadata);
    fs.writeFileSync(metadataPath, JSON.stringify(allMetadata, null, 2));
    
    res.redirect('/');
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send(`Error uploading file: ${error.message}`);
  }
});

// Function to get gallery items HTML
function getGalleryItems() {
  try {
    const metadataPath = path.join(galleryDir, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      return '<p>Нема отпремљених фотографија.</p>';
    }
    
    const data = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(data);
    
    return metadata.map(item => `
      <div class="gallery-item">
        <img src="/gallery/uploads/${item.filename}" alt="${item.caption}">
        <div class="caption">
          <p><strong>${item.location}</strong></p>
          <p>${item.caption}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error getting gallery items:', error);
    return `<p>Грешка при учитавању галерије: ${error.message}</p>`;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Upload server running at http://localhost:${port}`);
  console.log(`Gallery uploads will be saved to: ${uploadsDir}`);
});