// Import mongoose
import mongoose from "mongoose";

// Define the schema for health records
const healthRecordSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Types.ObjectId,
  },
  date: {
    type: Date,
  },
  doctorId: {
    type: mongoose.Types.ObjectId,
  },
  description: {
    type: String,
  },
  consultantId: {
    type: mongoose.Types.ObjectId,
  },
});

// Define a model using the schema
export const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
