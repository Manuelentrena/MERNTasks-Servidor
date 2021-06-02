import Usuarios from "../models/Usuario.js";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const crearUsuario = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Extraer email y password
  const { email, password } = req.body;
  try {
    // Revisar que el usuario registrado sea unico
    let usuario = await Usuarios.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    //crea el usuario nuevo
    usuario = new Usuarios(req.body);
    //Encriptamos el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);
    //Guardar usuario en la BD
    await usuario.save();
    //Crear y firmar el JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //Firmar el JWT
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600 /* equivale a una hora */,
      },
      (error, token) => {
        if (error) throw error;
        //Mensaje de confimación
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
