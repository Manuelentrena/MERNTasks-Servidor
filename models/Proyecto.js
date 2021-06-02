import mongoose from "mongoose";

const ProyectosSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuarios",
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Proyectos", ProyectosSchema);
