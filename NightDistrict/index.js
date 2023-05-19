import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import upload from 'express-fileupload';
import path from 'node:path';
import { MongoUtil } from './helpers/mongoUtils.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import socket from "./websockets/socket.js";
import users from "./routes/users.js";
import category from './routes/category.js';
import product from './routes/product.js';
import order from './routes/order.js';
import events from './routes/events.js';
import eventsPosts from './routes/eventsPosts.js';
import spotify from "./routes/spotify.js";
import list from './routes/list.js';
import ticket from './routes/ticket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

var PORT = process.env.PORT;
var DB_URL = process.env.DB_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(upload());
app.use(express.static("public"));

socket.init();

mongoose.connect(DB_URL, (err, db) => {
    if (err) console.error(err);
    let dbo = db.client.db('nightdistrict');
    MongoUtil.getInstance(dbo);
    console.log('Database Connected!');
});

app.use("/api/users", users);
app.use("/api/category",category);
app.use('/api/product',product);
app.use('/api/order',order);
app.use('/api/events',events);
app.use('/api/eventsPosts',eventsPosts);
app.use('/api/spotify',spotify);
app.use('/api/list',list);
app.use('/api/ticket', ticket);

app.use(express.static(path.join(__dirname, 'web')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));

