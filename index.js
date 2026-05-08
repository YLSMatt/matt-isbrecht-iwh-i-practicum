const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const customObjectId = '2-62152219';
    const properties = 'name,origin,effectiveness';
    const url = `https://api.hubapi.com/crm/v3/objects/${customObjectId}?properties=${properties}`;
    
    const headers = {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const response = await axios.get(url, { headers });
        const records = response.data.results;
        res.render('homepage', { 
            title: 'Martial Arts | Integrating With HubSpot I Practicum',
            records: records 
        });
    } catch (error) {
        console.error('Error fetching records:', error.response?.data || error.message);
        res.status(500).send('Error fetching records');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const customObjectId = '2-62152219';
    const url = `https://api.hubapi.com/crm/v3/objects/${customObjectId}`;
    
    const newRecord = {
        properties: {
            name: req.body.name,
            origin: req.body.origin,
            effectiveness: req.body.effectiveness
        }
    };
    
    const headers = {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };
    
    try {
        console.log('Token present:', process.env.HUBSPOT_ACCESS_TOKEN ? 'Yes' : 'No');
        console.log('Token starts with:', process.env.HUBSPOT_ACCESS_TOKEN?.substring(0, 10));  
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating record:', error.response?.data || error.message);
        res.status(500).send('Error creating record');
    }
});


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));