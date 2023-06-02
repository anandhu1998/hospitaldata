const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON in the request body
app.use(express.json());

// GET operation - Retrieve all hospitals
app.get('/hospitals', (req, res) => {
  fs.readFile('hospitals.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// POST operation - Create a new hospital
app.post('/hospitals', (req, res) => {
  fs.readFile('hospitals.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const hospitals = JSON.parse(data);
      hospitals.hospitals.push(req.body);
      const newData = JSON.stringify(hospitals, null, 2);
      fs.writeFile('hospitals.json', newData, (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json({ message: 'Hospital added successfully' });
        }
      });
    }
  });
});

// PUT operation - Update an existing hospital
app.put('/hospitals/:id', (req, res) => {
  const hospitalId = req.params.id;
  const updatedHospital = req.body;

  fs.readFile('hospitals.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const hospitals = JSON.parse(data);
      const index = hospitals.hospitals.findIndex((h) => h.id === hospitalId);
      if (index === -1) {
        res.status(404).json({ error: 'Hospital not found' });
      } else {
        hospitals.hospitals[index] = updatedHospital;
        const newData = JSON.stringify(hospitals, null, 2);
        fs.writeFile('hospitals.json', newData, (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json({ message: 'Hospital updated successfully' });
          }
        });
      }
    }
  });
});

// DELETE operation - Delete an existing hospital
app.delete('/hospitals/:id', (req, res) => {
  const hospitalId = req.params.id;

  fs.readFile('hospitals.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const hospitals = JSON.parse(data);
      const index = hospitals.hospitals.findIndex((h) => h.id === hospitalId);
      if (index === -1) {
        res.status(404).json({ error: 'Hospital not found' });
      } else {
        hospitals.hospitals.splice(index, 1);
        const newData = JSON.stringify(hospitals, null, 2);
        fs.writeFile('hospitals.json', newData, (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json({ message: 'Hospital deleted successfully' });
          }
        });
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
