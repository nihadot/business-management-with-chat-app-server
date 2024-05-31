// Import mongoose
import mongoose from "mongoose";

// Define the schema for consultation details
const consultationSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  childId: {
    type: mongoose.Types.ObjectId,
  },
  doctorId: {
    type: mongoose.Types.ObjectId,
  },
  status: {
    type: String,
    default:'schduled'
  },
});

// Define a model using the schema
const Consultation = mongoose.model("Consultation", consultationSchema);

// Export the model
export default Consultation;
