import express from 'express';
import pkg from 'agora-access-token';
import cors from 'cors';

const { RtmTokenBuilder, RtmRole } = pkg;

const app = express();
const PORT = 3000;

// Enable CORS for local development (adjust as needed for production)
app.use(cors());

const APP_ID = '38fc149915b541c0bf28bc49d731da91';
// const APP_CERTIFICATE = '933b0de12a23428c9760511c173d6d6f';
const EXPIRATION_TIME_IN_SECONDS = 3600; // 1 hour

// Route to generate and return an RTM token
app.get('/api/get-token', (req, res) => {
  const uid = req.query.uid || 'default-user';

  const role = RtmRole.Rtm_User;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + EXPIRATION_TIME_IN_SECONDS;

  try {
    const token = RtmTokenBuilder.buildToken(APP_ID, uid, role, expirationTimestamp);
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
