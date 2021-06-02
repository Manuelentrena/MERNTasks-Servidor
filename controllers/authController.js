import Usuarios from "../models/Usuario.js";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const autenticarUsuario = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer usuario y password del req
  const { email, password } = req.body;

  try {
    //Que exista el usuario
    let usuario = await Usuarios.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }
    //Que el password sea el correcto
    const passwordCorrect = await bcryptjs.compare(password, usuario.password);
    if (!passwordCorrect) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }
    //Crear JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //Firmamos JWT
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
  }
};

//Obtiene al usuario autenticado
export const usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.usuario.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
