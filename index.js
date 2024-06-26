const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com' 
});

const db = admin.firestore();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


// Configuración de Nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rics35dax@gmail.com',
    pass: 'fjic hmfi aorr hegw'
  }
});

// Endpoint para enviar correos electrónicos
app.post('/send-email', (req, res) => {
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
      console.error('Error al enviar el correo:', error);
      return res.status(500).send(error.toString());
    }
    res.status(200).json({ message: 'Correo enviado: ' + info.response });
  });
});

// Endpoint para obtener datos y generar QR
app.get('/get-data', async (req, res) => {
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


app.use(express.static(process.cwd() + '/public/'));



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

   
