const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

require('dotenv').config();

const googleApiKey = process.env.OUR_GOOGLE_API_KEY;
const spreadsheetId = process.env.YOUR_SPREADSHEET_ID;

const app = express();
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configure Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: googleApiKey });
const SPREADSHEET_ID = spreadsheetId;

app.get('/', (req, res) => {
  res.render('index');
});

async function getColumnValues(range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,  // Example: 'Sheet1!A2:A100'
  });
  const uniqueValues = [...new Set(response.data.values.flat())];
  return uniqueValues;
}

app.get('/dropdown_geo', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!E2:E');  // Fetch all values in column A
    res.json(data);  // Send data as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
app.get('/dropdown_part', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!J2:J');  // Fetch all values in column A
    res.json(data);  // Send data as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
app.get('/dropdown_series', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!M2:M');  // Fetch all values in column A
    res.json(data);  // Send data as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
app.get('/dropdown_medium', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!O2:O');  // Fetch all values in column A
    res.json(data);  // Send data as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.post('/search', async (req, res) => {
  console.log(req.body);
  const { name,email, firm, video, dropdown_geo, city, min, max, sweetspot, dropdown_part, tick1, tags, dropdown_series,  state, dropdown_medium  } = req.body;
  

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'PropTech VCs!A1:O', // Adjust range as per your sheet
    });

    const rows = result.data.values;
    if (rows.length) {
      const filteredResults = rows.filter(row => {
        // filtering logic
        /*

        rows=
        [
          [ 'Name', 'Email', 'Firm', 'Video' ],
          [
            'Kat Collins',
            'kat@1sharpe.com',
            '1Sharpe Capital',
            'https://youtu.be/rP5VDCXWdQs'
          ],
          [
            'Adam Schuit',
            'adam@aoproptech.com',
            'A/O PropTech',
            'https://youtu.be/wtZ30iNFPjY'
          ],
       ]

       row = 
          [
            'Kat Collins',
            'kat@1sharpe.com',
            '1Sharpe Capital',
            'https://youtu.be/rP5VDCXWdQs'
          ],

        */

        return (
          (row[0].includes(name)) &&
          (row[1].includes(email))&&
          (row[2].includes(firm))&&
          (row[3].includes(video))&&
          (row[4].includes(dropdown_geo))&&
          (row[5].includes(city))&&
          (row[9].includes(dropdown_part))&&
          (row[12].includes(dropdown_series))&&
          (row[13].includes(state))&&
          (row[14].includes(dropdown_medium ))
          
        );
        /*
        return (
          (!name || row[0]?.includes(name)) &&
          (!email|| row[1]?.includes(email)) &&
          (!firm|| row[1]?.includes(firm)) 
        );*/
      });
      console.log(filteredResults)

      res.json({ success: true, results: filteredResults });
    } else {
      res.json({ success: false, message: 'No data found' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error fetching data', error });
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

