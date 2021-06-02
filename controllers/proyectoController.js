import Proyectos from "../models/Proyecto.js";
import Tareas from "../models/Tarea.js";
import { validationResult } from "express-validator";

export const crearProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Crear nuevo proyecto
    const proyecto = new Proyectos(req.body);
    //Guardamos al creador
    proyecto.creador = req.usuario.id;
    //Guardamos el proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

export const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyectos.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

export const actualizarProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer la inf del pryecto
  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    //Revisar el id
    const proyecto = await Proyectos.findById(req.params.id);
    //Si el proyecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Proyecto no autorizado" });
    }

    //actualizar
    let proyectoActualizado = await Proyectos.findByIdAndUpdate(
      { _id: req.params.id },
      nuevoProyecto, //Buscar por el campo
      /* { $set: nuevoProyecto },  */ //Dato a grabar
      { new: true } //Para que devuelva lo nuevo y no lo anterior
    );
    res.json({ proyectoActualizado });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

export const eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyectos.findById(req.params.id);
    //Si el proyecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Proyecto no autorizado" });
    }
    await Tareas.deleteMany({ proyecto: req.params.id });
    //Eliminar el proyecto
    await Proyectos.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
