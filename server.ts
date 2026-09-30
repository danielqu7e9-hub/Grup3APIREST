import express from "express";
import tasklists from './routes/tasklists.routes'

const app = express();
const PORT = 15955;

// ENDPOINT /status
app.get('/status', (_req, res) => {
    res.json({status: "alive" });
    console.log("GET /status");
});

// Enrutador hacia tasklists
app.get('/tasklists', tasklists);

// Listening and starting the app in this port
app.listen(PORT, () => console.log(`Server on in port ${PORT}`))