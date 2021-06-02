/* const express = require('express'); */
import express from "express";
import conectarDB from "./config/db.js";
import usuariosRouter from "./routes/usuarios.js";
import authRouter from "./routes/auth.js";
import proyectosRouter from "./routes/proyectos.js";
import tareasRouter from "./routes/tareas.js";
import cors from "cors";

//crear server
const app = express();
//conectar a la BD
conectarDB();
//habilitar CORS
app.use(cors());
//Express.json habilitar
app.use(express.json({ extended: true }));
//Puerto de la app
const PORT = process.env.PORT || 5000;
//Importar nuestras rutas
app.use("/api/usuarios", usuariosRouter);
app.use("/api/auth", authRouter);
app.use("/api/proyectos", proyectosRouter);
app.use("/api/tareas", tareasRouter);
//Arrancar server
app.listen(PORT, () => {
  console.log(`El servidor esta arrancado en el puerto ${PORT}`);
});
