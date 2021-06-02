import mongoose from "mongoose";

const TareaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    default: false,
  },
  registro: {
    type: Date,
    default: Date.now(),
  },
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyectos",
  },
});

export default mongoose.model("Tareas", TareaSchema);
