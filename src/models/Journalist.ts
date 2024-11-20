import mongoose from "mongoose";
import { IJournalist } from "../../custom";

const JournalistSchema = new mongoose.Schema<IJournalist>({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        trim: true,
        required: true,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

export default JournalistSchema;