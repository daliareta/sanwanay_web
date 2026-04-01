require('dotenv').config(); 
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');

// --- DATABASE SETUP ---
let db;

// --- MIDDLEWARE ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'sanwanay-default-secret',
    resave: false, 
    saveUninitialized: true 
}));

// --- MIDDLEWARE TAMBAHAN (Satu Blok Aja Biar Gak Error) ---
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin || false;
    next(); 
});

// --- KONFIGURASI UPLOAD ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'ktp' ? path.join(__dirname, 'public/uploads/ktp/') : path.join(__dirname, 'public/uploads/');
        if (!fs.existsSync(folder)) { fs.mkdirSync(folder, { recursive: true }); }
        cb(null, folder);
    },
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- RUTE PUBLIK ---
app.get('/', (req, res) => res.render('index'));
app.get('/paket', (req, res) => res.render('paket'));
app.get('/jangkauan', (req, res) => res.render('jangkauan'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/daftar', (req, res) => res.render('daftar'));

// --- SISTEM LOGIN ---
app.get('/login', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin-dashboard');
    res.render('login', { error: req.query.error });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === process.env.ADMIN_PASSWORD) { 
        req.session.isAdmin = true;
        return res.redirect('/admin-dashboard');
    } else {
        return res.redirect('/login?error=1');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// --- FITUR KEGIATAN ---
app.get('/kegiatan', async (req, res) => {
    try {
        const listKegiatan = db ? await db.all('SELECT * FROM kegiatan ORDER BY id DESC') : [];
        res.render('kegiatan', { activities: listKegiatan });
    } catch (err) {
        res.render('kegiatan', { activities: [] });
    }
});

// --- DASHBOARD ADMIN ---
app.get('/admin-dashboard', async (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    try {
        const pendaftar = db ? await db.all('SELECT * FROM pendaftar ORDER BY id DESC') : [];
        const activities = db ? await db.all('SELECT * FROM kegiatan ORDER BY id DESC') : [];
        res.render('admin-dashboard', { pendaftar, activities });
    } catch (err) {
        res.render('admin-dashboard', { pendaftar: [], activities: [] });
    }
});

// --- ACTIONS ---
app.get('/hapus-pendaftar/:id', async (req, res, next) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    try {
        await db.run('DELETE FROM pendaftar WHERE id = ?', [req.params.id]);
        res.redirect('/admin-dashboard');
    } catch (err) {
        next(err);
    }
});

app.post('/upload-kegiatan', upload.single('foto'), async (req, res, next) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    try {
        const { judul, lokasi, deskripsi } = req.body;
        const foto = req.file ? `/uploads/${req.file.filename}` : '';
        await db.run('INSERT INTO kegiatan (judul, lokasi, deskripsi, foto) VALUES (?, ?, ?, ?)', [judul, lokasi, deskripsi, foto]);
        res.redirect('/admin-dashboard');
    } catch (err) {
        next(err);
    }
});

app.get('/hapus-kegiatan/:id', async (req, res, next) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    try {
        const activity = await db.get('SELECT foto FROM kegiatan WHERE id = ?', [req.params.id]);
        if (activity?.foto) {
            const filePath = path.join(__dirname, 'public', activity.foto);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (e) {
                    console.error("Gagal hapus file:", e.message);
                }
            }
        }
        await db.run('DELETE FROM kegiatan WHERE id = ?', [req.params.id]);
        res.redirect('/admin-dashboard');
    } catch (err) {
        next(err);
    }
});

app.post('/proses-daftar', upload.single('ktp'), async (req, res, next) => {
    try {
        if (!db) throw new Error("Database belum siap. Coba lagi dalam beberapa saat.");
        const { nama, phone, paket, alamat } = req.body;
        const ktp = req.file ? `/uploads/ktp/${req.file.filename}` : '';
        await db.run('INSERT INTO pendaftar (nama, phone, paket, alamat, ktp) VALUES (?, ?, ?, ?, ?)', [nama, phone, paket, alamat, ktp]);
        res.send("<script>alert('Pendaftaran Berhasil!'); window.location.href='/';</script>");
    } catch (err) {
        next(err);
    }
});

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("❌ Terjadi Error:", err.message);
    const detail = process.env.NODE_ENV === 'development' || process.env.VERCEL ? `: ${err.message}` : '';
    res.status(500).send(`Waduh, ada masalah di server kita${detail}. Coba lagi nanti ya, Bro!`);
});

const PORT = process.env.PORT || 3005;

// DATABASE INITIALIZATION (SERVERLESS FRIENDLY)
let dbPromise = null;

async function startServer() {
    if (dbPromise) return dbPromise;
    
    dbPromise = (async () => {
        try {
            // Gunakan folder /tmp di Vercel karena read-only di folder lain
            const dbPath = process.env.VERCEL ? path.join('/tmp', 'database.db') : path.join(__dirname, 'database.db');
            
            db = await open({
                filename: dbPath,
                driver: sqlite3.Database
            });

            await db.exec(`CREATE TABLE IF NOT EXISTS pendaftar (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                nama TEXT, 
                phone TEXT, 
                paket TEXT, 
                alamat TEXT, 
                ktp TEXT
            )`);

            await db.exec(`CREATE TABLE IF NOT EXISTS kegiatan (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                judul TEXT, 
                lokasi TEXT, 
                deskripsi TEXT, 
                foto TEXT
            )`);

            console.log("✅ Database Sanwanay Siap!");
            return db;
        } catch (error) {
            console.error("❌ Gagal memulai database:", error.message);
            // Jangan crash server, biarkan request jalan (UI tetap muncul)
            return null;
        }
    })();

    return dbPromise;
}

// Middleware untuk memastikan database siap sebelum request diproses
app.use(async (req, res, next) => {
    if (!db) {
        await startServer();
    }
    next();
});

if (require.main === module) {
    startServer().then(() => {
        app.listen(PORT, () => console.log(`✅ Sanwanay ON di http://localhost:${PORT}`));
    });
}

module.exports = app;