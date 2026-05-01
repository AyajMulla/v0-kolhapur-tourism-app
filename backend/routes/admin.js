const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');

// Multer: in-memory storage (no disk writes)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');

// Apply both auth and admin middlewares to EVERY route in this file
router.use(auth, admin);

// --- USER MANAGEMENT (Admin Only) ---

// @route   GET /api/admin/users
// @desc    Get all admin users
router.get('/users', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/admin/users/create-admin
// @desc    Create a new admin user (Restricted to existing admins)
router.post('/users/create-admin', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields (name, email, password)' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({
      msg: 'Admin user created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- PLACES CRUD ---
router.post('/places', async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    await newPlace.save();
    res.json(newPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/admin/places/bulk-upload
// @desc    Bulk import places from CSV or Excel file
router.post('/places/bulk-upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  const ext = req.file.originalname.split('.').pop().toLowerCase();
  let rows = [];

  try {
    if (ext === 'csv') {
      // Parse CSV buffer
      rows = parse(req.file.buffer, {
        columns: true,       // first row = headers
        skip_empty_lines: true,
        trim: true,
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      // Parse Excel buffer
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Upload a .csv or .xlsx file.' });
    }

    if (!rows.length) return res.status(400).json({ error: 'File is empty or has no data rows.' });

    // Map CSV columns → Place schema fields
    const places = rows.map((row, idx) => {
      const lat = parseFloat(row.coordinates_lat || row.latitude || row.lat || 0);
      const lng = parseFloat(row.coordinates_lng || row.longitude || row.lng || 0);
      return {
        id: (row.id || '').trim(),
        name: (row.name || '').trim(),
        description: (row.description || '').trim(),
        image: (row.image || '/placeholder.jpg').trim(),
        category: (row.category || '').trim(),
        rating: parseFloat(row.rating) || 4.0,
        visitDuration: (row.visitDuration || row.visit_duration || '').trim(),
        bestTimeToVisit: (row.bestTimeToVisit || row.best_time || '').trim(),
        talukaId: (row.talukaId || row.taluka_id || '').trim(),
        talukaName: (row.talukaName || row.taluka_name || '').trim(),
        coordinates: (lat && lng) ? [lat, lng] : [],
        visitorTips: row.visitorTips
          ? String(row.visitorTips).split('|').map(s => s.trim()).filter(Boolean)
          : [],
      };
    });

    // Validate: id and name are required
    const errors = [];
    const valid = [];
    places.forEach((p, idx) => {
      if (!p.id || !p.name || !p.description || !p.category) {
        errors.push({ row: idx + 2, reason: `Missing required field(s): ${[!p.id&&'id',!p.name&&'name',!p.description&&'description',!p.category&&'category'].filter(Boolean).join(', ')}` });
      } else {
        valid.push(p);
      }
    });

    if (!valid.length) {
      return res.status(400).json({ inserted: 0, skipped: 0, errors });
    }

    // insertMany with ordered:false — skips duplicates, continues inserting valid rows
    const result = await Place.insertMany(valid, { ordered: false }).catch(err => {
      // Collect duplicate key errors
      if (err.writeErrors) {
        err.writeErrors.forEach(we => {
          errors.push({ row: '?', reason: `Duplicate id: ${we.err?.op?.id || 'unknown'}` });
        });
        return { insertedCount: err.insertedDocs ? err.insertedDocs.length : (valid.length - err.writeErrors.length) };
      }
      throw err;
    });

    const insertedCount = result.insertedCount !== undefined ? result.insertedCount : (Array.isArray(result) ? result.length : valid.length);

    return res.json({
      inserted: insertedCount,
      skipped: valid.length - insertedCount + errors.filter(e => e.reason.startsWith('Duplicate')).length,
      errors,
      total: rows.length,
    });

  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/admin/hotels/bulk-upload
// @desc    Bulk import hotels from CSV or Excel file
router.post('/hotels/bulk-upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  const ext = req.file.originalname.split('.').pop().toLowerCase();
  let rows = [];

  try {
    if (ext === 'csv') {
      rows = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Upload a .csv or .xlsx file.' });
    }

    if (!rows.length) return res.status(400).json({ error: 'File is empty or has no data rows.' });

    const hotels = rows.map((row) => ({
      id: (row.id || '').trim(),
      name: (row.name || '').trim(),
      category: (row.category || '').trim(),
      rating: parseFloat(row.rating) || 4.0,
      image: (row.image || '').trim(),
      priceRange: (row.priceRange || row.price_range || '').trim(),
      amenities: row.amenities ? String(row.amenities).split('|').map(s => s.trim()).filter(Boolean) : [],
      address: (row.address || '').trim(),
      phone: (row.phone || '').trim(),
      website: (row.website || '').trim(),
      talukaId: (row.talukaId || row.taluka_id || '').trim(),
      talukaName: (row.talukaName || row.taluka_name || '').trim(),
    }));

    const errors = [];
    const valid = [];
    hotels.forEach((h, idx) => {
      if (!h.id || !h.name || !h.category || !h.address) {
        errors.push({ row: idx + 2, reason: `Missing required field(s): ${[!h.id&&'id',!h.name&&'name',!h.category&&'category',!h.address&&'address'].filter(Boolean).join(', ')}` });
      } else {
        valid.push(h);
      }
    });

    if (!valid.length) return res.status(400).json({ inserted: 0, skipped: 0, errors });

    const result = await Hotel.insertMany(valid, { ordered: false }).catch(err => {
      if (err.writeErrors) {
        err.writeErrors.forEach(we => errors.push({ row: '?', reason: `Duplicate id: ${we.err?.op?.id || 'unknown'}` }));
        return { insertedCount: err.insertedDocs ? err.insertedDocs.length : (valid.length - err.writeErrors.length) };
      }
      throw err;
    });

    const insertedCount = result.insertedCount !== undefined ? result.insertedCount : (Array.isArray(result) ? result.length : valid.length);
    return res.json({ inserted: insertedCount, skipped: valid.length - insertedCount + errors.filter(e => e.reason.startsWith('Duplicate')).length, errors, total: rows.length });
  } catch (err) {
    console.error('Hotel bulk upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/admin/restaurants/bulk-upload
// @desc    Bulk import restaurants from CSV or Excel file
router.post('/restaurants/bulk-upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  const ext = req.file.originalname.split('.').pop().toLowerCase();
  let rows = [];

  try {
    if (ext === 'csv') {
      rows = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Upload a .csv or .xlsx file.' });
    }

    if (!rows.length) return res.status(400).json({ error: 'File is empty or has no data rows.' });

    const restaurants = rows.map((row) => ({
      id: (row.id || '').trim(),
      name: (row.name || '').trim(),
      cuisine: (row.cuisine || '').trim(),
      rating: parseFloat(row.rating) || 4.0,
      priceRange: (row.priceRange || row.price_range || '').trim(),
      specialties: row.specialties ? String(row.specialties).split('|').map(s => s.trim()).filter(Boolean) : [],
      address: (row.address || '').trim(),
      phone: (row.phone || '').trim(),
      openHours: (row.openHours || row.open_hours || '').trim(),
      talukaId: (row.talukaId || row.taluka_id || '').trim(),
      talukaName: (row.talukaName || row.taluka_name || '').trim(),
    }));

    const errors = [];
    const valid = [];
    restaurants.forEach((r, idx) => {
      if (!r.id || !r.name || !r.cuisine || !r.address) {
        errors.push({ row: idx + 2, reason: `Missing required field(s): ${[!r.id&&'id',!r.name&&'name',!r.cuisine&&'cuisine',!r.address&&'address'].filter(Boolean).join(', ')}` });
      } else {
        valid.push(r);
      }
    });

    if (!valid.length) return res.status(400).json({ inserted: 0, skipped: 0, errors });

    const result = await Restaurant.insertMany(valid, { ordered: false }).catch(err => {
      if (err.writeErrors) {
        err.writeErrors.forEach(we => errors.push({ row: '?', reason: `Duplicate id: ${we.err?.op?.id || 'unknown'}` }));
        return { insertedCount: err.insertedDocs ? err.insertedDocs.length : (valid.length - err.writeErrors.length) };
      }
      throw err;
    });

    const insertedCount = result.insertedCount !== undefined ? result.insertedCount : (Array.isArray(result) ? result.length : valid.length);
    return res.json({ inserted: insertedCount, skipped: valid.length - insertedCount + errors.filter(e => e.reason.startsWith('Duplicate')).length, errors, total: rows.length });
  } catch (err) {
    console.error('Restaurant bulk upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/places/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    const place = await Place.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    if (!place) return res.status(404).json({ msg: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/places/:id', async (req, res) => {
  try {
    const place = await Place.findOneAndDelete({ id: req.params.id });
    if (!place) return res.status(404).json({ msg: 'Place not found' });
    res.json({ msg: 'Place deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HOTELS CRUD ---
router.post('/hotels', async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.json(newHotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/hotels/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    const hotel = await Hotel.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({ id: req.params.id });
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json({ msg: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- RESTAURANTS CRUD ---
router.post('/restaurants', async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.json(newRestaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/restaurants/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    const rest = await Restaurant.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    if (!rest) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json(rest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/restaurants/:id', async (req, res) => {
  try {
    const rest = await Restaurant.findOneAndDelete({ id: req.params.id });
    if (!rest) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json({ msg: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
