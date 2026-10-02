const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const appointmentSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    doctorName: {
        type: String
    },
    disease: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'today', 'completed', 'cancelled'],
        default: 'active'
    },
    prescriptions: [{
        medicines: [{
            name: String,
            dosage: String,
            duration: String,
            instructions: String
        }],
        date: { type: Date, default: Date.now },
        notes: String
    }],
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

const consultationSchema = new mongoose.Schema({
    disease: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: false
    },
    doctorName: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    prescriptions: [{
        medicines: [{
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            duration: { type: String, required: true },
            instructions: { type: String }
        }],
        date: { type: Date, default: Date.now },
        notes: { type: String }
    }]
});

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true,
        unique: true
    },
    disease: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    appointments: [appointmentSchema],
    consultations: [consultationSchema],
    role: { 
        type: String, 
        default: 'patient',
        required: true 
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    assignmentStatus: {
        type: String,
        enum: ['pending_assignment', 'assigned'],
        default: 'pending_assignment'
    },
    assignmentNotification: {
        assigned: { type: Boolean, default: false },
        doctorName: { type: String },
        doctorSpecialization: { type: String },
        consultationDate: { type: Date },
        notes: { type: String },
        viewed: { type: Boolean, default: false },
        assignedAt: { type: Date }
    }
}, { timestamps: true });

patientSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Patient", patientSchema);
