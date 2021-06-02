import express from "express";
import { check } from "express-validator";
import {
  crearProyecto,
  obtenerProyectos,
  actualizarProyecto,
  eliminarProyecto,
} from "../controllers/proyectoController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* api/proyectos */

router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  crearProyecto
);

router.get("/", auth, obtenerProyectos);

router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  actualizarProyecto
);

router.delete("/:id", auth, eliminarProyecto);

export default router;
