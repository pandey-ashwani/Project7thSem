const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin');
const Doctor = require('../models/doctor');
const SuperAdmin = require('../models/superAdmin');
const Patient = require('../models/patient');

// Configure Local Strategies
passport.use('local-admin', new LocalStrategy(Admin.authenticate()));
passport.use('local-doctor', new LocalStrategy(Doctor.authenticate()));
passport.use('local-superadmin', new LocalStrategy(SuperAdmin.authenticate()));
passport.use('local-patient', new LocalStrategy(Patient.authenticate()));

// Serialize User
passport.serializeUser((user, done) => {
    done(null, { 
        id: user._id.toString(), 
        role: user.role, 
        modelName: user.constructor.modelName 
    });
});

// Deserialize User
passport.deserializeUser(async (sessionData, done) => {
    try {
        if (!sessionData) return done(null, null);

        const id = typeof sessionData === 'object' ? (sessionData.id || sessionData._id) : sessionData;
        const role = typeof sessionData === 'object' ? (sessionData.role || sessionData.modelName) : null;

        let user = null;
        if (role === 'admin' || role === 'Admin') {
            user = await Admin.findById(id);
        } else if (role === 'doctor' || role === 'Doctor') {
            user = await Doctor.findById(id);
        } else if (role === 'superAdmin' || role === 'superadmin' || role === 'SuperAdmin') {
            user = await SuperAdmin.findById(id);
        } else if (role === 'patient' || role === 'Patient') {
            user = await Patient.findById(id);
        }

        // Fallback search across models if role was undefined
        if (!user) {
            user = await Admin.findById(id) || 
                   await Doctor.findById(id) || 
                   await SuperAdmin.findById(id) || 
                   await Patient.findById(id);
        }

        done(null, user);
    } catch (err) {
        console.error("Passport deserialize error:", err);
        done(err, null);
    }
});

module.exports = passport;
