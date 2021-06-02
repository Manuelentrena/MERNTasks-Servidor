import express from "express";
import { check } from "express-validator";
import {
  crearTarea,
  obtenerTareas,
  actualizarTareas,
  eliminarTarea,
} from "../controllers/tareaController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

//api/tareas
router.post(
  "/",
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("proyecto", "El proyecto es obligatorio").not().isEmpty(),
  ],
  crearTarea
);
router.get("/", auth, obtenerTareas);
router.put("/:id", auth, actualizarTareas);
router.delete("/:id", auth, eliminarTarea);

export default router;
