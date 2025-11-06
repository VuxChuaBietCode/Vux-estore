//const express = require('express');

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js'; 
import { aj } from './lib/arcjet.js';

import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


app.use(express.json());//middleware to parse JSON request bodies

app.use(cors());//middleware to enable CORS

app.use(helmet(
    {
        contentSecurityPolicy: false,
    }
));//middleware for security HTTP headers

app.use(morgan("dev"));//middleware for logging HTTP requests

//apply areject to protect
app.use (async (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
    // ⚠️ Skip Arcjet on development mode
    return next();
  }


    try{
        const decision = await aj.protect(req, {
            requested:1 //specifities that each request counts as 1 token
        });
     if (decision.isDenied) {
      switch (decision.reason) {
        case 'RATE_LIMITED':
          return res.status(429).json({ error: 'Too Many Requests' });
        case 'BOT_DETECTED':
          return res.status(403).json({ error: 'Bot Access Denied' });
        case 'SPOOFED':
          return res.status(403).json({ error: 'Spoofed Bot Detected' });
        default:
          return res.status(403).json({ error: 'Forbidden' });
      }
    }


        next();

    }catch (error) {
        console.log("Arcjet error", error);
        next(error);
    }
})

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"/Frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname,"/Frontend/dist/index.html"));
    });
}

async function initDB(){
    try{
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        console.log("Database initialized");
    }catch (error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, ()=> {
    console.log("Server is running on port " + PORT);
    });
});