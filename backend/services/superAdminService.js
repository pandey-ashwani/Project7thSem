const { Patient, Doctor, Admin, Policy, SuperAdmin } = require('../models');
const { NotFoundError } = require('../utils/errors');

class SuperAdminService {
  // 1. Aggregated Statewide Analytics
  async getAnalytics() {
    const allPatients = await Patient.find();
    const allPolicies = await Policy.find().sort({ createdAt: -1 });
    const allDoctors = await Doctor.find();
    const allAdmins = await Admin.find();

    const totalPatients = allPatients.length;
    const totalDoctors = allDoctors.length;
    const totalHospitals = [...new Set(allPatients.map((p) => p.hospital).filter(Boolean))].length;
    const totalDistricts = [...new Set(allPatients.map((p) => p.district).filter(Boolean))].length;
    const totalDiseases = [...new Set(allPatients.map((p) => p.disease).filter(Boolean))].length;
    const activePolicies = allPolicies.filter((p) => p.status === 'active').length;

    // Disease distribution for charts
    const diseaseCounts = {};
    allPatients.forEach((p) => {
      const d = p.disease || 'General Symptoms';
      diseaseCounts[d] = (diseaseCounts[d] || 0) + 1;
    });

    // Hospital distribution for charts
    const hospitalCounts = {};
    allPatients.forEach((p) => {
      const h = p.hospital || 'General Hospital';
      hospitalCounts[h] = (hospitalCounts[h] || 0) + 1;
    });

    // District distribution for charts
    const districtCounts = {};
    allPatients.forEach((p) => {
      const d = p.district || 'Unassigned District';
      districtCounts[d] = (districtCounts[d] || 0) + 1;
    });

    // Monthly patient registration trend
    const monthlyCounts = {};
    allPatients.forEach((p) => {
      const date = p.createdAt ? new Date(p.createdAt) : new Date();
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    return {
      metrics: {
        totalPatients,
        totalDoctors,
        totalHospitals,
        totalDistricts,
        totalDiseases,
        totalAdmins: allAdmins.length,
        activePolicies
      },
      charts: {
        diseases: diseaseCounts,
        hospitals: hospitalCounts,
        districts: districtCounts,
        monthly: monthlyCounts
      }
    };
  }

  // 2. Statewide Patient Surveillance with Filtering
  async getPatients(filters = {}) {
    const query = {};

    if (filters.district && filters.district !== 'all') {
      query.district = filters.district;
    }

    if (filters.hospital && filters.hospital !== 'all') {
      query.hospital = filters.hospital;
    }

    if (filters.disease && filters.disease !== 'all') {
      query.disease = filters.disease;
    }

    if (filters.search) {
      const term = filters.search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { aadhar: { $regex: term, $options: 'i' } },
        { disease: { $regex: term, $options: 'i' } },
        { hospital: { $regex: term, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .populate('doctor', 'name specialization hospital email')
      .populate('admin', 'name email hospital')
      .sort({ createdAt: -1 });

    return patients;
  }

  // 3. Statewide Doctors
  async getDoctors() {
    const doctors = await Doctor.find()
      .populate('admin', 'name email hospital district state')
      .sort({ createdAt: -1 });

    return doctors;
  }

  // 4. Hospital Network Summary
  async getHospitals() {
    const allPatients = await Patient.find();
    const allDoctors = await Doctor.find();
    const allAdmins = await Admin.find();

    const hospitalMap = {};

    // Populate from admins
    allAdmins.forEach((a) => {
      const hName = a.hospital || 'Hospital Facility';
      if (!hospitalMap[hName]) {
        hospitalMap[hName] = {
          name: hName,
          district: a.district || 'N/A',
          state: a.state || 'N/A',
          adminName: a.name,
          adminEmail: a.email,
          patientCount: 0,
          doctorCount: 0
        };
      }
    });

    // Populate from doctors
    allDoctors.forEach((d) => {
      const hName = d.hospital || 'Hospital Facility';
      if (!hospitalMap[hName]) {
        hospitalMap[hName] = {
          name: hName,
          district: d.district || 'N/A',
          state: d.state || 'N/A',
          adminName: 'Unassigned',
          patientCount: 0,
          doctorCount: 0
        };
      }
      hospitalMap[hName].doctorCount += 1;
    });

    // Populate patient counts
    allPatients.forEach((p) => {
      const hName = p.hospital;
      if (hName && hospitalMap[hName]) {
        hospitalMap[hName].patientCount += 1;
      }
    });

    return Object.values(hospitalMap);
  }

  // 5. Policies CRUD
  async getPolicies() {
    const policies = await Policy.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return policies;
  }

  async createPolicy(data, adminId) {
    const { title, description, category, status, effectiveDate } = data;

    const newPolicy = new Policy({
      title: title.trim(),
      description: description.trim(),
      category,
      status: status || 'active',
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      createdBy: adminId
    });

    await newPolicy.save();
    return newPolicy;
  }

  async updatePolicy(id, data) {
    const updated = await Policy.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      throw new NotFoundError('Policy not found.');
    }

    return updated;
  }

  async deletePolicy(id) {
    const deleted = await Policy.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError('Policy not found.');
    }
    return true;
  }

  // 6. SuperAdmin Profile
  async getProfile(adminId) {
    const superAdmin = await SuperAdmin.findById(adminId);
    if (!superAdmin) {
      throw new NotFoundError('SuperAdmin profile not found.');
    }
    return superAdmin;
  }
}

module.exports = new SuperAdminService();
