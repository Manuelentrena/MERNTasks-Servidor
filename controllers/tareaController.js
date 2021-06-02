import Tareas from "../models/Tarea.js";
import Proyectos from "../models/Proyecto.js";
import { validationResult } from "express-validator";

export const crearTarea = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Extraer el proyecto y comprobar si existeç
  const { proyecto } = req.body;
  try {
    const data = await Proyectos.findById(proyecto);
    if (!data) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //Revisar que el usuario este autenticado
    if (data.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Proyecto no autorizado" });
    }

    //Creamos la tarea
    const tareaNueva = new Tareas(req.body);
    await tareaNueva.save();
    res.json({ tareaNueva });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

export const obtenerTareas = async (req, res) => {
  //Extraer el proyecto y comprobar si existe
  const { proyecto } = req.query;
  console.log(proyecto);
  try {
    const data = await Proyectos.findById(proyecto);
    if (!data) {
      return res.status(404).json({ msg: "Proyecto no encontrado 3" });
    }
    //Revisar que el usuario este autenticado
    if (data.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Proyecto no autorizado" });
    }
    //Obtener todas las tareas por proyecto
    const tareas = await Tareas.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

export const actualizarTareas = async (req, res) => {
  const { proyecto, _id } = req.body;
  try {
    const tarea = await Tareas.findById(_id);
    //Revisar si la tarea existe

    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }
    //Extraer el proyecto y comprobar si existe
    const data = await Proyectos.findById(proyecto);

    if (!data) {
      return res.status(404).json({ msg: "" });
    }

    //que la tarea pertenezca al proyecto
    if (tarea.proyecto.toString() !== proyecto) {
      return res
        .status(401)
        .json({ msg: "Tarea no pertenece a este proyecto" });
    }
    //Revisar que el usuario este autenticado
    if (data.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Proyecto no autorizado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }

  let tareaActualizada = await Tareas.findOneAndUpdate(
    { _id: _id }, //Buscar por el campo
    req.body, //Dato a grabar
    { new: true } //Para que devuelva lo nuevo y no lo anterior
  );
  res.json({ tareaActualizada });
};

export const eliminarTarea = async (req, res) => {
  const { proyecto } = req.query;
  try {
    const tarea = await Tareas.findById(req.params.id);
    //Revisar si la tarea existe
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }
    //Extraer el proyecto y comprobar si existe
    const data = await Proyectos.findById(proyecto);
    if (!data) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //que la tarea pertenezca al proyecto
    if (tarea.proyecto.toString() !== proyecto) {
      return res
        .status(401)
        .json({ msg: "Tarea no pertenece a este proyecto" });
    }
    //Revisar que el usuario este autenticado
    if (data.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Proyecto no autorizado" });
    }

    //Eliminar TArea
    await Tareas.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
