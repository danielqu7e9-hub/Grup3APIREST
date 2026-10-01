import express, { type Request, type Response, type NextFunction } from "express"
import tasklists from "./routes/tasklists.routes";

const app = express();
const PORT = 15955;

app.use(express.json());

// MIDDLEWARE Log the requests 
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// ENDPOINT /status
app.get('/status', (req, res) => {
    res.json({status: "alive" });
});

// MIDDLEWARE Router the tasklists
app.use('/tasklists', tasklists);

// MIDDLEWARE Log errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(500).json({ message: "Error interno" });
});

// Listening and starting the app in this port
app.listen(PORT, () => console.log(`Server on in port ${PORT}`))
