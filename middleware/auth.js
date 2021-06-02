import jwt from "jsonwebtoken";

export default function (req, res, next) {
  //Leer el token
  const token = req.header("x-auth-token");

  //Revisar si no hay token
  if (!token) return res.status(401).json({ msg: "Usuario sin token" });

  //Validar el token
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA); //Desciframos el token
    req.usuario = cifrado.usuario; //Agregamos el payload del token a nuestra req recibida
    next(); //pasamos al siguiente middleware
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
    console.log(error);
  }
}
