const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

require('dotenv').config();

const googleApiKey = process.env.OUR_GOOGLE_API_KEY;
const spreadsheetId = process.env.YOUR_SPREADSHEET_ID;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configure Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: googleApiKey });
const SPREADSHEET_ID = spreadsheetId;

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/search', async (req, res) => {
  const { text1, text2, dropdown1, dropdown2, tick1, tick2 } = req.body;

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:D', // Adjust range as per your sheet
    });

    const rows = result.data.values;
    if (rows.length) {
      const filteredResults = rows.filter(row => {
        // Example filtering logic
        return (
          (!text1 || row[0]?.includes(text1)) &&
          (!text2 || row[1]?.includes(text2)) &&
          (!dropdown1 || row[2] === dropdown1) &&
          (!dropdown2 || row[3] === dropdown2)
        );
      });

      res.json({ success: true, results: filteredResults });
    } else {
      res.json({ success: false, message: 'No data found' });
    }
  } catch (error) {
    res.json({ success: false, message: 'Error fetching data', error });
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

