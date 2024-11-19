import mongoose from "mongoose";
import { IJournalist } from "../../custom";

const JournalistSchema = new mongoose.Schema<IJournalist>({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
      },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

export default JournalistSchema;