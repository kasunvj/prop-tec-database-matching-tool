/*
Prop-tec Investor matching tool
Author: Kasun Jayalath
Date: 13/01/2025

Todo 
  - Filtering for sweetspot is to be implemented
  - Filtering for tags is to be implemented
  - Filtering for proptec or non proptec is to be implemented 

*/

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

// Google-sheets API
const sheets = google.sheets({ version: 'v4', auth: googleApiKey });
const SPREADSHEET_ID = spreadsheetId;

app.get('/', (req, res) => {
  res.render('index');
});

async function getColumnValues(range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range, 
  });
  const uniqueValues = [...new Set(response.data.values.flat())];
  return uniqueValues;
}

//Fetching values for geography info dropdown
app.get('/dropdown_geo', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!E2:E');  
    res.json(data);  
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

//Fetching values for participation method dropdown
app.get('/dropdown_part', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!J2:J');  
    res.json(data);  
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

//Fetching values for series dropdown
app.get('/dropdown_series', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!M2:M'); 
    res.json(data); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

//Fetching values for tec medium dropdown
app.get('/dropdown_medium', async (req, res) => {
  try {
    const data = await getColumnValues('PropTech VCs!O2:O');  // Fetch all values in column A
    res.json(data);  // Send data as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});


//clicking the submit button 
app.post('/search', async (req, res) => {
  console.log(req.body);
  var { name,email, firm, video, dropdown_geo, city, min, max, sweetspot, dropdown_part, tick1, tags, dropdown_series,  state, dropdown_medium  } = req.body;
  

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'PropTech VCs!A1:O', // Adjust range as per your sheet
    });

    const rows = result.data.values;
    if (rows.length) {
      const filteredResults = rows.filter(row => {

        /*
        Filtering logic
        Visit below link for more details
        https://drive.google.com/file/d/1OnZbHr1iRpesnyKIcMf9toUmsV26t1L8/view?usp=sharing

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
          (!name || row[0]?.toLowerCase().includes(name.toLowerCase())) &&
          (!email || row[1]?.toLowerCase().includes(email.toLowerCase()))&&
          (!firm || row[2]?.toLowerCase().includes(firm.toLowerCase()))&&
          (!video || row[3]?.toLowerCase().includes(video.toLowerCase()))&&
          (!dropdown_geo.length ||dropdown_geo.some(item => row[4]?.includes(item)))&&
          (city || row[5]?.toLowerCase().includes(city.toLowerCase()))&&
          (parseInt(row[6]?.replace(/[,$]/g, '')) > parseInt(min)? true : !min)&&
          (parseInt(row[7]?.replace(/[,$]/g, '')) < parseInt(max)? true : !max)&&
          (!dropdown_part.length || dropdown_part.some(item => row[9]?.includes(item)))&&
          (!dropdown_series.length || dropdown_series.some(item => row[12]?.includes(item)))&&
          (!state || row[13].toLowerCase()?.includes(state.toLowerCase()))&&
          (!dropdown_medium.length || dropdown_medium.some(item => row[14]?.includes(item)))
          
          
        );
      });
      //console.log(filteredResults)

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

