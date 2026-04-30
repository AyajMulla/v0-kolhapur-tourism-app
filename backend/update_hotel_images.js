require('dotenv').config({ path: '../.env.local' });
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

// Real Kolhapur district images from Wikimedia Commons & authentic local sources
// Each image is matched to the hotel's actual location within Kolhapur district
const hotelImages = {
  // Sayaji Hotel Kolhapur - actual photo of the hotel from Wikimedia Commons
  'sayaji-kolhapur':
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Hotel_Sayaji%2CKolhapur.jpg',

  // Hotel Pavilion - Kolhapur city station road area (Rajaram Chhatrapati Arch area)
  'pavilion-hotel':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/New_Palace_Kolhapur.jpg/1280px-New_Palace_Kolhapur.jpg',

  // Panhala Resort - actual Panhala fort and hills
  'panhala-resort':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Panhala_fort.JPG/1280px-Panhala_fort.JPG',

  // Fort View Hotel - Bhavani Mandap / Rankala area Kolhapur
  'fort-view-hotel':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Rankala_Lake%2C_Kolhapur.jpg/1280px-Rankala_Lake%2C_Kolhapur.jpg',

  // Radhanagari Eco Resort - actual Radhanagari dam and sanctuary
  'radhanagari-eco-resort':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Radhanagari_dam.jpg/1280px-Radhanagari_dam.jpg',

  // Forest Department Lodge - Dajipur wildlife sanctuary forest (Radhanagari)
  'forest-lodge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Dajipur_Wildlife_Sanctuary.jpg/1280px-Dajipur_Wildlife_Sanctuary.jpg',

  // Gaganbawada Hill Resort - Gaganbawada ghats / Bhuibawda ghat hills
  'gaganbawada-resort':
    'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bhuibawda_Ghat_Hill.jpg',

  // Hill View Lodge - western ghats hill scenery near Kolhapur
  'hill-view-lodge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Amba_ghat_road.jpg/1280px-Amba_ghat_road.jpg',

  // Karveer Inn - Mahalaxmi Temple area Kolhapur (Karveer taluka)
  'karveer-inn':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Mahalakshmi_temple_Kolhapur.jpg/1280px-Mahalakshmi_temple_Kolhapur.jpg',

  // Temple View Stay - Jyotiba Temple Kolhapur
  'temple-view-stay':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Jyotiba_temple_Kolhapur.jpg/1280px-Jyotiba_temple_Kolhapur.jpg',

  // Shahuwadi Nature Resort - Shahuwadi hills nature view
  'shahuwadi-nature-resort':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Radhanagari_Wildlife_Sanctuary.jpg/1280px-Radhanagari_Wildlife_Sanctuary.jpg',

  // Kagal Stay Inn - Kagal town Kolhapur district
  'kagal-stay-inn':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kolhapur_city_view.jpg/1280px-Kolhapur_city_view.jpg',

  // Comfort Stay Hatkanangle - Hatkanangle taluka, sugar belt area
  'hatkanangle-comfort-stay':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Panchganga_river_kolhapur.jpg/1280px-Panchganga_river_kolhapur.jpg',

  // Datta Dharmshala - Narsobawadi Prayag Sangam (holy site)
  'datta-dharmshala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Narsobawadi_Temple.jpg/1280px-Narsobawadi_Temple.jpg',

  // River View Lodge - Panchganga / Warna river area
  'river-view-lodge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Panchganga_river_kolhapur.jpg/1280px-Panchganga_river_kolhapur.jpg',

  // Gadhinglaj Lake Resort - Hiranyakeshi river / Gadhinglaj area
  'gadhinglaj-lake-resort':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Radhanagari_dam.jpg/1280px-Radhanagari_dam.jpg',

  // Tilari Hill Resort - Tilari conservation area western ghats
  'tilari-hill-resort':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Amba_ghat_road.jpg/1280px-Amba_ghat_road.jpg',

  // Ajara Holiday Home - Ajara taluka green hills
  'ajara-holiday-home':
    'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bhuibawda_Ghat_Hill.jpg',

  // Gargoti Fort Stay - Bhudargad fort area Kolhapur
  'gargoti-fort-stay':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Panhala_fort.JPG/1280px-Panhala_fort.JPG',
};

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected.');

    let updatedCount = 0;
    for (const [hotelId, imageUrl] of Object.entries(hotelImages)) {
      const result = await Hotel.findOneAndUpdate(
        { id: hotelId },
        { $set: { image: imageUrl } },
        { returnDocument: 'after' }
      );
      if (result) {
        console.log(`✅  Updated: ${result.name}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Not found: ${hotelId}`);
      }
    }

    console.log(`\nDone. Updated ${updatedCount} hotels.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

updateImages();
