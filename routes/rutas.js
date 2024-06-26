const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com' // Replace with your Firebase URL
});

const db = admin.firestore();

const port = 3000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer configuration
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rics35dax@gmail.com',
    pass: 'fjic hmfi aorr hegw' // Ensure you keep this secure
  }
});

// Endpoint to send emails
router.post('/send-email', (req, res) => {
  const { subject, email, description } = req.body;

  console.log(`Subject: ${subject}`);
  console.log(`Email: ${email}`);
  console.log(`Description: ${description}`);

  let mailOptions = {
    from: 'rics35dax@gmail.com',
    to: email,
    subject: subject,
    text: `Descripcion de los datos: "${description}", reviselos a la brevedad, recuerde ser puntual.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email: ' + error.toString());
    }
    res.status(200).json({ message: 'Correo enviado: ' + info.response });
  });
});


router.post('/send-email1', (req, res) => {
  const { email } = req.body;

  console.log(`Email: ${email}`);

  let mailOptions = {
      from: 'rics35dax@gmail.com',
      to: 'firebaseequipotw@gmail.com',  
      subject: 'Solicitud de Información',
      text: `El correo ${email} solicito información: "que sea informacion acerca de la adopcion"`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).send(error.toString());
      }
      res.status(200).json({ message: 'Correo enviado: ' + info.response });
    });
});

// Endpoint to fetch data and generate QR
router.get('/get-data', async (req, res) => {
  try {
    const citasSnapshot = await db.collection('citas').get();
    const citas = citasSnapshot.docs.map(doc => doc.data());
    const randomCitas = [];

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * citas.length);
      randomCitas.push(citas[randomIndex]);
    }

    res.json({ qrData: randomCitas });
  } catch (error) {
    console.error('Error fetching citas:', error);
    res.status(500).send('Error fetching citas');
  }
});

// Apply routes to the app
router.use('/api', router);




module.exports = router;