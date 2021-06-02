import express from "express";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
import {
  autenticarUsuario,
  usuarioAutenticado,
} from "../controllers/authController.js";

const router = express.Router();

/* api/auth */
//Para autenticarse
router.post("/", autenticarUsuario);
//Obtiene el usuario autenticado
router.get("/", auth, usuarioAutenticado);

export default router;
