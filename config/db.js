import mongoose from "mongoose";
import dotenv from "dotenv";

//path de las variables de entorno
dotenv.config({ path: "variables.env" });

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("DB conectada");
  } catch (error) {
    console.log(error);
    process.exit(1); //Si hay error detiene la app
  }
};

export default conectarDB;
