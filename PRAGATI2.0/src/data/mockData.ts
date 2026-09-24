import { 
  Challenge, 
  Startup, 
  Application, 
  ExpertEvaluation, 
  PilotProject, 
  ProcurementContract, 
  ScaleUpPlan, 
  ImpactRecord,
  AuditLogEntry, 
  AppNotification 
} from '../types';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-pwd-01',
    title: 'AI-Based Pothole Detection and Road Condition Monitoring',
    department: 'Public Works Department (PWD)',
    category: 'Smart Infrastructure & Transport',
    status: 'Pilot Active',
    createdAt: '2026-09-01',
    deadline: '2026-10-15',
    budgetRange: '₹35 - 50 Lakhs',
    pilotDuration: '90 Days',
    currentSituation: 'Manual road surveys are slow, cover less than 15% of arterial roads monthly, and lack geo-referenced severity tracking, leading to delayed repairs and public grievances.',
    problemDescription: 'We need an automated, high-precision computer vision system deployable on municipal maintenance vehicles and public buses to detect road distress, classify severity, and generate geo-tagged repair work orders in near real-time.',
    targetOutcome: 'Continuous road surface health mapping across 500+ km of urban corridors with automated alert triggers to municipal road maintenance divisions within 6 hours of distress emergence.',
    techArea: ['Computer Vision', 'Edge AI', 'IoT Telemetry', 'GIS Mapping'],
    requiredCapabilities: [
      'High-speed optical pavement distress detection (up to 60 km/h)',
      'Sub-meter GPS precision for pothole geo-tagging',
      'Classification into Pothole, Rutting, Alligator Cracks, and Ravelling',
      'Offline edge inference with automated cloud telemetry sync'
    ],
    kpis: [
      { name: 'Detection Accuracy', target: '≥ 90%', unit: '%' },
      { name: 'False Positive Rate', target: '≤ 10%', unit: '%' },
      { name: 'Average Detection Time', target: '≤ 5 seconds', unit: 'sec' },
      { name: 'Network Road Coverage', target: '≥ 80%', unit: '%' }
    ],
    constraints: [
      'Must function under Indian road lighting & monsoon wet surface conditions',
      'Camera hardware must easily mount on standard Bolero/Tata Ace inspection vehicles',
      'Adhere to NIC and CERT-In data security standards'
    ],
    eligibility: {
      startupAgeYears: 7,
      turnover: 'Up to ₹25 Cr (DPIIT Recognized)',
      minExperienceYears: 2,
      techRequirements: ['Proprietary CV/ML model', 'Edge computing hardware readiness'],
      certifications: ['DPIIT Startup Certificate', 'ISO 9001 or ISO 27001']
    },
    evaluationCriteria: [
      { name: 'Technical Capability', weight: 25, maxScore: 25, description: 'Model accuracy, edge latency, hardware durability' },
      { name: 'Innovation & Novelty', weight: 20, maxScore: 20, description: 'Patents, proprietary edge models, adaptive lighting handling' },
      { name: 'Scalability & Integration', weight: 20, maxScore: 20, description: 'API architecture, GIS compatibility, cloud throughput' },
      { name: 'Cost Effectiveness', weight: 15, maxScore: 15, description: 'Per-km monitoring cost compared to manual inspection' },
      { name: 'Public Impact & Safety', weight: 20, maxScore: 20, description: 'Reduction in road fatalities and quick repair turnaround' }
    ],
    applicationsCount: 8
  },
  {
    id: 'ch-agri-02',
    title: 'Autonomous Pest Infestation Early-Warning using Drone Imagery',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Agritech & Food Security',
    status: 'Applications Open',
    createdAt: '2026-09-05',
    deadline: '2026-10-30',
    budgetRange: '₹40 - 65 Lakhs',
    pilotDuration: '120 Days',
    currentSituation: 'Pest outbreaks in cotton and paddy are identified after visual foliage damage, leading to heavy pesticide overuse and 30% crop yield loss.',
    problemDescription: 'Deploy automated hyperspectral/multispectral drone imagery pipelines with crop health AI to detect Fall Armyworm and Brown Planthopper at egg/early nymph stages.',
    targetOutcome: 'Reduce regional crop yield loss by 20% and provide localized farmer SMS advisories 7 days before widespread infestation.',
    techArea: ['Drone Tech', 'Hyperspectral Imaging', 'Edge AI', 'Agronomy Models'],
    requiredCapabilities: ['Sub-millimeter canopy resolution', 'Automated flight pathing', 'Offline stitcher'],
    kpis: [
      { name: 'Infestation Detection Recall', target: '≥ 88%' },
      { name: 'False Alarm Rate', target: '≤ 12%' },
      { name: 'Advisory Latency', target: '≤ 12 hours' }
    ],
    constraints: ['DGCA certified drones only', 'Farmers multilingual voice support'],
    eligibility: {
      startupAgeYears: 5,
      turnover: 'Up to ₹10 Cr',
      minExperienceYears: 1,
      techRequirements: ['Agritech drone AI experience'],
      certifications: ['DPIIT Startup Certificate']
    },
    evaluationCriteria: [
      { name: 'Technical Capability', weight: 30, maxScore: 30, description: 'Spectral accuracy and pest classifier F1-score' },
      { name: 'Scalability', weight: 25, maxScore: 25, description: 'Acres mapped per hour and operational drone cost' },
      { name: 'Impact on Smallholders', weight: 25, maxScore: 25, description: 'Farmer uptake and actionable advisory clarity' },
      { name: 'Cost Effectiveness', weight: 20, maxScore: 20, description: 'Cost per acre scanned vs conventional scouting' }
    ],
    applicationsCount: 14
  },
  {
    id: 'ch-health-03',
    title: 'Intelligent OPD Queue Orchestration & Real-Time Bed Allocation',
    department: 'Ministry of Health & Family Welfare',
    category: 'Healthcare & Public Delivery',
    status: 'Under Review',
    createdAt: '2026-08-20',
    deadline: '2026-09-28',
    budgetRange: '₹30 - 45 Lakhs',
    pilotDuration: '60 Days',
    currentSituation: 'District hospital outpatient departments face 4-6 hour patient wait times with zero visibility on doctor availability or ICU bed turnover.',
    problemDescription: 'Implement dynamic AI triaging and queue redistribution coupled with real-time bed tracking across 3 pilot district civil hospitals.',
    targetOutcome: 'Cut outpatient wait time by 50% and achieve 95% occupancy visibility in under 2 minutes.',
    techArea: ['Queueing Theory Algorithms', 'ABDM Integration', 'SMS / WhatsApp Bot', 'Analytics'],
    requiredCapabilities: ['ABDM M2/M3 compliance', 'Multilingual kiosks', 'HL7 FHIR API support'],
    kpis: [
      { name: 'Patient Wait Time Reduction', target: '≥ 40%' },
      { name: 'Queue Prediction Accuracy', target: '≥ 92%' }
    ],
    constraints: ['Zero hardware lock-in', 'Strict patient confidentiality under DPDP Act'],
    eligibility: {
      startupAgeYears: 5,
      turnover: 'Up to ₹15 Cr',
      minExperienceYears: 2,
      techRequirements: ['Hospital Information Management experience'],
      certifications: ['ABDM Sandbox Certified', 'DPIIT']
    },
    evaluationCriteria: [
      { name: 'Technical Capability', weight: 25, maxScore: 25, description: 'ABDM integration and queue load balance' },
      { name: 'User Experience', weight: 25, maxScore: 25, description: 'Ease of use for rural and senior patients' },
      { name: 'Scalability', weight: 25, maxScore: 25, description: 'Multi-hospital rollout readiness' },
      { name: 'Impact', weight: 25, maxScore: 25, description: 'Patient satisfaction and turnaround' }
    ],
    applicationsCount: 19
  },
  {
    id: 'ch-water-04',
    title: 'Smart Leakage & Non-Revenue Water (NRW) Acoustic AI Grid',
    department: 'Jal Jeevan Mission / Urban Water Board',
    category: 'Clean Water & Utilities',
    status: 'Applications Open',
    createdAt: '2026-09-08',
    deadline: '2026-10-25',
    budgetRange: '₹50 - 75 Lakhs',
    pilotDuration: '90 Days',
    currentSituation: '35% of potable water is lost underground through micro-fissures before reaching household meters.',
    problemDescription: 'Deploy non-invasive acoustic sensors on pipeline valves with AI pattern recognition to pinpoint underground leak coordinates within 2 meters.',
    targetOutcome: 'Reduce non-revenue water loss by 60% in pilot municipal ward.',
    techArea: ['Acoustic AI', 'IoT Edge Sensors', 'GIS Pipeline Twin'],
    requiredCapabilities: ['Battery life > 3 years', 'Real-time noise filtering'],
    kpis: [{ name: 'Leak Pinpoint Accuracy', target: '≤ 2 meters' }],
    constraints: ['Must withstand pipe vibrations and road traffic acoustics'],
    eligibility: {
      startupAgeYears: 8,
      turnover: 'Up to ₹20 Cr',
      minExperienceYears: 2,
      techRequirements: ['Acoustic signal processing experience'],
      certifications: ['DPIIT Startup Certificate']
    },
    evaluationCriteria: [
      { name: 'Technical Capability', weight: 30, maxScore: 30, description: 'Sensor battery & signal resolution' },
      { name: 'Cost Effectiveness', weight: 30, maxScore: 30, description: 'Capex per kilometer of pipeline' },
      { name: 'Impact', weight: 40, maxScore: 40, description: 'Estimated million liters of water saved daily' }
    ],
    applicationsCount: 11
  }
];

export const MOCK_STARTUPS: Startup[] = [
  {
    id: 'startup-trafficpulse',
    name: 'TrafficPulse AI',
    tagline: 'Edge AI Sensors & Dynamic Adaptive Traffic Signal Optimization for Urban Corridors',
    domain: 'Smart Mobility & Urban Traffic AI',
    techStack: ['Edge AI Sensors', 'Computer Vision', 'LiDAR & Radar Fusion', 'SCATS/ITMS API', 'Reinforcement Learning'],
    location: 'Bengaluru, Karnataka',
    stage: 'Growth (Series A)',
    foundedYear: 2022,
    pilotReadiness: 'High',
    eligibilityStatus: 'Eligible',
    teamSize: 34,
    revenueRange: '₹4.5 Cr (FY 2025-26)',
    completedPilotsCount: 5,
    certifications: ['DPIIT Recognized (DIPP77123)', 'ISO 9001:2015', 'Make in India Certified', 'MoRTH ITS Certified'],
    matchScore: 96,
    matchBreakdown: {
      techMatch: 98,
      domainExperience: 96,
      pilotReadiness: 95,
      scalability: 94,
      eligibility: 100
    },
    overview: 'TrafficPulse AI deploys intelligent edge-computer vision cameras and mmWave radar sensors at municipal intersections. By analyzing live vehicle queue length, non-lane density, and emergency vehicle sirens, its reinforcement learning algorithm dynamically recalculates green signal timings in real-time, slashing junction delays by up to 32%.',
    pastProjects: [
      { name: 'Bengaluru Hebbal Junction Adaptive Signal Pilot', client: 'Bengaluru Traffic Police (BTP)', impact: 'Reduced peak-hour corridor wait times by 28% across 6 junctions' },
      { name: 'Ahmedabad BRTS Corridor Green Wave Project', client: 'Ahmedabad Urban Transport', impact: 'Prioritized BRTS bus passage with 99.4% on-time corridor transit' },
      { name: 'Delhi Police Automated Red-Light & Congestion Feasibility', client: 'Delhi Traffic Police', impact: 'Monitored 45,000 vehicles/hour under dense mixed traffic' }
    ]
  },
  {
    id: 'startup-roadvision',
    name: 'RoadVision AI',
    tagline: 'Edge AI Computer Vision for Road Infrastructure & Asset Intelligence',
    domain: 'Smart Infrastructure & Computer Vision',
    techStack: ['Edge AI', 'YOLOv10 Custom', 'TensorRT', 'GIS GeoJSON', 'IoT Telemetry'],
    location: 'Bengaluru, Karnataka',
    stage: 'Growth (Series A Seed)',
    foundedYear: 2023,
    pilotReadiness: 'High',
    eligibilityStatus: 'Eligible',
    teamSize: 28,
    revenueRange: '₹3.2 Cr (FY 2025-26)',
    completedPilotsCount: 4,
    certifications: ['DPIIT Recognized (DIPP89234)', 'ISO 9001:2015', 'ISO 27001 Data Security', 'Make in India Certified'],
    matchScore: 94,
    matchBreakdown: {
      techMatch: 96,
      domainExperience: 92,
      pilotReadiness: 95,
      scalability: 91,
      eligibility: 100
    },
    overview: 'RoadVision AI is a pioneering Indian deep-tech startup building real-time road condition analysis systems. Using low-cost automotive dashcams retrofitted with edge processors, RoadVision detects potholes, lane wear, and bridge fissures at highway speeds up to 80 km/h with 94%+ verified accuracy.',
    pastProjects: [
      { name: 'Bengaluru Outer Ring Road Pothole Audit', client: 'BBMP Smart City', impact: 'Detected 1,840 defects across 62 km in 4 days' },
      { name: 'NH-48 Expressway Pavement Scanner', client: 'NHAI Regional Office', impact: 'Reduced manual survey expenditure by 68%' },
      { name: 'Pune Smart City Municipal Pilot', client: 'Pune Municipal Corp', impact: 'Integrated with municipal 311 citizen grievance portal' }
    ]
  },
  {
    id: 'startup-farmvision',
    name: 'FarmVision Technologies',
    tagline: 'Autonomous Precision Aerial Scouting & Crop Health AI',
    domain: 'AI + Agriculture',
    techStack: ['Autonomous Drones', 'Multispectral Vision', 'PyTorch', 'Micro-weather Models'],
    location: 'Hyderabad, Telangana',
    stage: 'Early Growth',
    foundedYear: 2022,
    pilotReadiness: 'High',
    eligibilityStatus: 'Eligible',
    teamSize: 18,
    revenueRange: '₹1.8 Cr',
    completedPilotsCount: 3,
    certifications: ['DPIIT Recognized', 'DGCA Type Certified Drones'],
    matchScore: 89,
    matchBreakdown: {
      techMatch: 92,
      domainExperience: 90,
      pilotReadiness: 88,
      scalability: 84,
      eligibility: 100
    },
    overview: 'FarmVision builds lightweight drone payloads and proprietary computer vision models that identify pest attacks and soil nitrogen deficiency with plant-by-plant precision.',
    pastProjects: [
      { name: 'Telangana Cotton Belt Pest Early Alert', client: 'Dept of Agriculture', impact: 'Covered 12,000 acres, prevented 18% loss' }
    ]
  },
  {
    id: 'startup-healthqueue',
    name: 'HealthQueue AI',
    tagline: 'Intelligent OPD Flow & Predictive Hospital Bed Logistics',
    domain: 'Healthcare AI & Hospital Operations',
    techStack: ['ABDM M2/M3', 'Predictive ML', 'FastAPI', 'WhatsApp Enterprise Bot'],
    location: 'Gurugram, Haryana',
    stage: 'Growth',
    foundedYear: 2021,
    pilotReadiness: 'High',
    eligibilityStatus: 'Eligible',
    teamSize: 22,
    revenueRange: '₹2.9 Cr',
    completedPilotsCount: 5,
    certifications: ['DPIIT Recognized', 'ABDM Sandbox Certified', 'HIPAA/DPDP Compliant'],
    matchScore: 91,
    matchBreakdown: {
      techMatch: 94,
      domainExperience: 95,
      pilotReadiness: 92,
      scalability: 88,
      eligibility: 100
    },
    overview: 'HealthQueue AI streamlines high-volume government hospitals using predictive queue orchestration, digital OPD tokenization, and real-time bed analytics.',
    pastProjects: [
      { name: 'Haryana Civil Hospital Triage Pilot', client: 'Haryana Health Mission', impact: 'Reduced OPD patient turnaround time from 210 mins to 95 mins' }
    ]
  },
  {
    id: 'startup-smartcitylabs',
    name: 'SmartCity Labs',
    tagline: 'IoT Edge Computing & Real-time Acoustic Utility Leak Mapping',
    domain: 'IoT + AI Urban Infrastructure',
    techStack: ['Acoustic Micro-sensors', 'LoRaWAN', 'Fast Fourier Transform AI', 'GIS Twin'],
    location: 'Pune, Maharashtra',
    stage: 'Early Stage',
    foundedYear: 2023,
    pilotReadiness: 'Medium',
    eligibilityStatus: 'Eligible',
    teamSize: 14,
    revenueRange: '₹95 Lakhs',
    completedPilotsCount: 2,
    certifications: ['DPIIT Recognized', 'CE/FCC Telemetry Certified'],
    matchScore: 84,
    matchBreakdown: {
      techMatch: 86,
      domainExperience: 82,
      pilotReadiness: 78,
      scalability: 85,
      eligibility: 100
    },
    overview: 'Specializes in low-power acoustic sensors that clamp onto water mains to pinpoint pressurized pipeline micro-leaks within a 2-meter radius before surface eruption.',
    pastProjects: [
      { name: 'Pimpri-Chinchwad Water Audit', client: 'PCMC Water Dept', impact: 'Detected 42 hidden underground leaks saving 1.2 MLD water' }
    ]
  },
  {
    id: 'startup-edutechinnovations',
    name: 'EduTech Innovations',
    tagline: 'Multilingual Offline-First Adaptive Learning & Foundational Literacy',
    domain: 'EdTech + AI',
    techStack: ['On-Device Speech AI', 'Indic NLP', 'Lightweight Android APK', 'Bluetooth Mesh'],
    location: 'Noida, Uttar Pradesh',
    stage: 'Growth',
    foundedYear: 2022,
    pilotReadiness: 'High',
    eligibilityStatus: 'Eligible',
    teamSize: 19,
    revenueRange: '₹2.1 Cr',
    completedPilotsCount: 4,
    certifications: ['DPIIT Recognized', 'DIKSHA Compatible'],
    matchScore: 82,
    matchBreakdown: {
      techMatch: 85,
      domainExperience: 88,
      pilotReadiness: 82,
      scalability: 80,
      eligibility: 100
    },
    overview: 'Creates voice-enabled AI learning tutors that run locally on low-cost government school tablets in Hindi, Tamil, Telugu, and Marathi without internet dependency.',
    pastProjects: [
      { name: 'DIET Tribal School Literacy Initiative', client: 'Samagra Shiksha Abhiyan', impact: 'Improved reading comprehension scores by 34% across 80 schools' }
    ]
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-pwd-roadvision',
    challengeId: 'ch-pwd-01',
    challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
    department: 'Public Works Department (PWD)',
    startupId: 'startup-roadvision',
    startupName: 'RoadVision AI',
    submissionDate: '2026-09-15',
    status: 'Pilot',
    technicalProposal: 'RoadVision proposes deploying 12 Edge-AI dashcam units mounted on PWD zonal inspection vehicles. The model processes 30 FPS 4K video using TensorRT-optimized YOLOv10 to localize and measure potholes with 94.2% precision and sub-meter GIS coordinates.',
    implementationPlan: 'Phase 1: Hardware retrofitting (Day 1-14). Phase 2: Calibration on 50 km arterial corridor (Day 15-30). Phase 3: Daily monitoring and PWD dashboard integration (Day 31-75). Phase 4: Verification and KPI sign-off (Day 76-90).',
    expectedImpact: '80% reduction in road survey turnaround, saving an estimated ₹18 Lakhs in manual inspection tenders, and cutting pothole-related accident response times by 3.5x.',
    budgetQuoted: '₹38,50,000 (inclusive of 12 edge units, cloud telemetry, dashboard, and 12-month maintenance)',
    pilotPlan: '90-Day controlled deployment covering 500 km of high-traffic state highways and urban arterial corridors under the Bengaluru North PWD division.',
    documents: [
      'Technical_Architecture_RoadVision_v2.pdf',
      'DPIIT_Startup_Certificate.pdf',
      'ISO_9001_Quality_Certification.pdf',
      'Audited_Financials_FY25.pdf',
      'Client_Endorsement_BBMP.pdf'
    ],
    expertScore: 91,
    expertRecommendation: 'Shortlist for Pilot'
  },
  {
    id: 'app-agri-farmvision',
    challengeId: 'ch-agri-02',
    challengeTitle: 'Autonomous Pest Infestation Early-Warning using Drone Imagery',
    department: 'Department of Agriculture & Farmers Welfare',
    startupId: 'startup-farmvision',
    startupName: 'FarmVision Technologies',
    submissionDate: '2026-09-18',
    status: 'Expert Evaluation',
    technicalProposal: 'Automated 6-band multispectral drone survey covering 2,000 hectares weekly with edge-stitched vegetation index maps and automated farmer SMS alerts.',
    implementationPlan: 'Fleet deployment of 4 DGCA-approved drones across Nizamabad district.',
    expectedImpact: 'Prevent up to ₹1.2 Cr in crop damage during Kharif season.',
    budgetQuoted: '₹48,00,000',
    pilotPlan: '120-Day pilot across 15 gram panchayats.',
    documents: ['FarmVision_Drone_RFP_Response.pdf', 'DGCA_Certification.pdf']
  },
  {
    id: 'app-health-healthqueue',
    challengeId: 'ch-health-03',
    challengeTitle: 'Intelligent OPD Queue Orchestration & Real-Time Bed Allocation',
    department: 'Ministry of Health & Family Welfare',
    startupId: 'startup-healthqueue',
    startupName: 'HealthQueue AI',
    submissionDate: '2026-09-10',
    status: 'Under Review',
    technicalProposal: 'ABDM-integrated queue manager with token kiosks and WhatsApp notifications.',
    implementationPlan: 'Deploy in Civil Hospital Gurugram and Sector 10 Hospital.',
    expectedImpact: 'Cut patient wait times by 55%.',
    budgetQuoted: '₹34,00,000',
    pilotPlan: '60-Day live hospital validation.',
    documents: ['HealthQueue_ABDM_Compliance.pdf', 'Technical_Proposal.pdf']
  }
];

export const INITIAL_EVALUATIONS: ExpertEvaluation[] = [
  {
    id: 'eval-pwd-01',
    applicationId: 'app-pwd-roadvision',
    challengeId: 'ch-pwd-01',
    challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
    startupId: 'startup-roadvision',
    startupName: 'RoadVision AI',
    evaluatorName: 'Dr. Arvind Swaminathan',
    evaluatorSpecialization: 'Professor of Transportation AI, IIT Madras / MoRTH Technical Advisor',
    date: '2026-09-20',
    scores: {
      technicalCapability: 23, // out of 25
      innovation: 18,          // out of 20
      scalability: 18,         // out of 20
      costEffectiveness: 14,   // out of 15
      impact: 18               // out of 20
    },
    totalScore: 91,
    recommendation: 'Shortlist for Pilot',
    remarks: 'The proprietary edge inference model demonstrated commendable robustness on dusty and monsoon-distorted lens captures. The proposed 12-unit deployment on standard municipal vehicles is practical and avoids expensive specialized survey vans. Highly recommended for a 90-day pilot deployment in Bengaluru North corridor.',
    isSubmitted: true
  }
];

export const INITIAL_PILOTS: PilotProject[] = [
  {
    id: 'pilot-pwd-roadvision',
    challengeId: 'ch-pwd-01',
    challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
    startupId: 'startup-roadvision',
    startupName: 'RoadVision AI',
    department: 'Public Works Department (Bengaluru North)',
    pilotDuration: '90 Days',
    startDate: '2026-09-25',
    endDate: '2026-12-24',
    status: 'In Progress',
    progressPercent: 82,
    milestones: [
      { id: 'm1', title: 'Pilot Approved & Agreement Executed', date: '2026-09-25', status: 'Completed', deliverables: 'Tripartite MoU signed, 12 inspection vehicles mapped' },
      { id: 'm2', title: 'Hardware Deployment & Vehicle Retrofit', date: '2026-10-05', status: 'Completed', deliverables: '12 Edge AI cameras mounted and vibration tested' },
      { id: 'm3', title: 'Corridor Data Collection & Calibration', date: '2026-10-25', status: 'Completed', deliverables: '520 km mapped with baseline ground-truth validation' },
      { id: 'm4', title: 'Live Stress Testing & Municipal GIS Sync', date: '2026-11-15', status: 'Completed', deliverables: 'Real-time telemetry streaming to PWD central portal' },
      { id: 'm5', title: 'KPI Benchmarking & Field Audits', date: '2026-12-05', status: 'In Progress', deliverables: 'Independent PWD engineer verification of detected potholes' },
      { id: 'm6', title: 'Final Validation & Committee Sign-off', date: '2026-12-24', status: 'Upcoming', deliverables: 'Final pilot outcome report and procurement evaluation' }
    ],
    kpis: [
      { name: 'Detection Accuracy', target: '≥ 90%', actual: '94.2%', unit: '%', status: 'Exceeded', targetNum: 90, actualNum: 94.2 },
      { name: 'False Positive Rate', target: '≤ 10%', actual: '6.1%', unit: '%', status: 'Exceeded', targetNum: 10, actualNum: 6.1 },
      { name: 'Average Detection Time', target: '≤ 5.0 sec', actual: '3.2 sec', unit: 's', status: 'Exceeded', targetNum: 5.0, actualNum: 3.2 },
      { name: 'Road Network Coverage', target: '≥ 80%', actual: '87.0%', unit: '%', status: 'Exceeded', targetNum: 80, actualNum: 87.0 }
    ],
    validationDecision: 'Scale',
    validationScore: 91,
    validationRemarks: 'The solution exceeded all predefined pilot KPIs and demonstrated strong operational performance. High reliability during night-time and light rain runs. PWD maintenance teams resolved 420+ critical road hazards with 48-hour turnarounds.',
    decisionDate: '2026-12-10',
    authorizedOfficial: 'Er. Rajeshwar Rao, Chief Engineer, PWD'
  }
];

export const INITIAL_PROCUREMENT: ProcurementContract[] = [
  {
    id: 'contract-pwd-0926',
    pilotId: 'pilot-pwd-roadvision',
    challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
    startupName: 'RoadVision AI',
    department: 'Public Works Department (PWD)',
    validatedSolution: 'RoadVision Edge AI Highway & Urban Asset Monitoring Suite (v2.4)',
    pilotResultsSummary: 'Verified 94.2% detection accuracy over 520 km corridor with 3.2s edge inference time. 6.1% false positives (well below 10% ceiling).',
    approvedBudget: '₹38,50,000',
    procurementMethod: 'Section 7(3) Innovation Fast-Track / GeM Startup Runway Framework',
    contractStatus: 'Active',
    executedDate: '2026-12-15',
    milestones: [
      {
        milestoneNumber: 1,
        title: 'Milestone 1: Deployment & System Integration',
        payout: '₹11,55,000 (30%)',
        status: 'Released',
        deliverable: 'Delivery of 12 production edge units, cloud infrastructure provisioning, and operator training'
      },
      {
        milestoneNumber: 2,
        title: 'Milestone 2: 90-Day Operational Performance Validation',
        payout: '₹15,40,000 (40%)',
        status: 'Pending Verification',
        deliverable: 'Continuous uptime of 99.2%, 1,500 km monthly audit cycles, and automated work-order generation'
      },
      {
        milestoneNumber: 3,
        title: 'Milestone 3: Final System Acceptance & Transition',
        payout: '₹11,55,000 (30%)',
        status: 'Upcoming',
        deliverable: 'Source code escrow deposit, API integration with State PWD ERP, and warranty support onboarding'
      }
    ]
  }
];

export const INITIAL_SCALE_UP: ScaleUpPlan = {
  id: 'scale-pwd-roadvision',
  challengeId: 'CH-001',
  challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
  startupId: 'startup-roadvision',
  startupName: 'RoadVision AI',
  solutionName: 'State-Wide Intelligent Road Health Grid',
  pilotId: 'pilot-pwd-roadvision',
  pilotTitle: 'AI Road Condition & Pothole Monitoring Pilot',
  procurementId: 'contract-pwd-0926',
  procurementReferenceId: 'REF-GFR173-0926',
  title: 'Karnataka State-Wide Intelligent Road Condition & Pothole Monitoring Grid',
  description: 'Large-scale state infrastructure rollout following successful outcome-validated pilot and GeM innovation procurement award.',
  targetScope: '32,000 km across 31 Districts and 14 State Highway Corridors',
  targetRegions: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Tumakuru', 'Hubballi-Dharwad', 'Belagavi', 'Mangaluru', 'Kalaburagi'],
  expectedBeneficiaries: '6.4 Crore citizens & 2.1 Million daily highway commuters',
  estimatedBudget: '₹4,25,00,000',
  estimatedCost: '₹4.25 Crores (Multi-Year Phase-Wise Deployment)',
  implementationTimeline: '18 Months (Q1 2027 - Q3 2028)',
  responsibleGovernmentDepartment: 'Public Works Department (PWD), Government of Karnataka',
  risks: 'Edge camera sensor degradation during monsoon; cellular dead zones on Western Ghats highways',
  mitigation: 'IP68-rated dual enclosures, local offline edge inference buffering, and hybrid 4G/satellite burst telemetry',
  status: 'Active',
  createdAt: '2026-12-20',
  updatedAt: '2026-12-24',
  authorizedOfficial: 'Er. Rajeshwar Rao, Chief Engineer, PWD',
  expectedImpact: 'Annual savings of ₹14.8 Cr in recurring road repair delays and estimated 22% reduction in monsoon road accident fatalities.',
  currentDeployment: '520 km (1 Zone: Bengaluru North)',
  targetDeployment: '32,000 km (31 Districts across Karnataka)',
  milestones: [
    {
      milestoneNumber: 1,
      title: 'Phase 1: Initial Multi-District Core Corridor Setup',
      timeline: 'Months 1-4',
      deliverable: 'Deployment of 45 vehicle-mounted AI edge sensor pods across 5 key highways',
      status: 'Completed',
      targetDistrict: 'Bengaluru Urban & Rural',
      budgetAllocation: '₹95,00,000'
    },
    {
      milestoneNumber: 2,
      title: 'Phase 2: Regional Hub & PWD Division Integration',
      timeline: 'Months 5-10',
      deliverable: 'GIS dashboard integration across 12 PWD circle offices with automated road defect dispatch',
      status: 'In Progress',
      targetDistrict: 'Mysuru, Tumakuru, Hubballi',
      budgetAllocation: '₹1,50,00,000'
    },
    {
      milestoneNumber: 3,
      title: 'Phase 3: Statewide Network Coverage & Citizen Portal',
      timeline: 'Months 11-18',
      deliverable: 'Full coverage of 32,000 km state network and real-time public road health transparency API',
      status: 'Pending',
      targetDistrict: 'Remaining 23 Districts',
      budgetAllocation: '₹1,80,00,000'
    }
  ],
  kpis: [
    { metric: 'Road Network Coverage', baseline: '520 km', target: '32,000 km', current: '5,020 km', status: 'Tracking' },
    { metric: 'Edge Detection Accuracy', baseline: '94.2%', target: '≥ 95.0%', current: '94.8%', status: 'Tracking' },
    { metric: 'Repair Work Order Dispatch', baseline: '14 Days', target: '< 48 Hours', current: '52 Hours', status: 'Tracking' },
    { metric: 'Citizen Grievance Resolution', baseline: '45%', target: '> 90%', current: '82%', status: 'Tracking' }
  ],
  scalePhases: [
    {
      phase: 'Phase 1',
      title: 'Controlled Municipal Pilot',
      coverage: '520 km (1 Division)',
      timeline: 'Q3 2026 (Completed)',
      status: 'Completed',
      districts: ['Bengaluru Urban']
    },
    {
      phase: 'Phase 2',
      title: 'High-Density Multi-District Expansion',
      coverage: '4,500 km (5 Critical Highway Corridors)',
      timeline: 'Q1 - Q2 2027',
      status: 'Active',
      districts: ['Bengaluru Rural', 'Mysuru', 'Tumakuru', 'Hubballi-Dharwad', 'Belagavi']
    },
    {
      phase: 'Phase 3',
      title: 'State-Wide Comprehensive Highway Rollout',
      coverage: '32,000 km (Entire State Road Network)',
      timeline: 'Q3 2027 - Q4 2028',
      status: 'Planned',
      districts: ['All 31 Districts (State PWD & Rural Development)']
    }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-01',
    timestamp: '2026-09-12 10:15:22 IST',
    userRole: 'Government Officer',
    userName: 'R. Sharma (PWD Bengaluru)',
    action: 'Challenge Created',
    details: 'Initiated draft for AI-Based Pothole Detection and Road Condition Monitoring using AI Assistant.',
    status: 'Completed'
  },
  {
    id: 'log-02',
    timestamp: '2026-09-13 14:30:00 IST',
    userRole: 'Department Head',
    userName: 'Er. Rajeshwar Rao (Chief Engineer)',
    action: 'Challenge Published',
    details: 'Approved budget of ₹35-50L and published challenge to public portal for 45 days.',
    status: 'Completed'
  },
  {
    id: 'log-03',
    timestamp: '2026-09-15 16:45:10 IST',
    userRole: 'Startup Founder',
    userName: 'Ananya Deshmukh (RoadVision AI)',
    action: 'Application Submitted',
    details: 'Submitted technical proposal, 90-day pilot schedule, and DPIIT startup accreditation.',
    status: 'Completed'
  },
  {
    id: 'log-04',
    timestamp: '2026-09-17 11:20:05 IST',
    userRole: 'Automated Screening',
    userName: 'PragatiAI Rule Engine',
    action: 'Eligibility Verified',
    details: '100% compliance met across DPIIT criteria, age (3 yrs), turnover (<₹25 Cr), and certifications.',
    status: 'Verified'
  },
  {
    id: 'log-05',
    timestamp: '2026-09-20 18:05:40 IST',
    userRole: 'Expert Evaluator',
    userName: 'Dr. Arvind Swaminathan (IIT Madras)',
    action: 'Expert Evaluation Completed',
    details: 'Scored 91/100 across 5 weighted criteria. Official recommendation: Shortlist for Pilot.',
    status: 'Verified'
  },
  {
    id: 'log-06',
    timestamp: '2026-09-25 09:30:15 IST',
    userRole: 'Government Officer',
    userName: 'Er. Rajeshwar Rao (Chief Engineer)',
    action: 'Pilot Approved & Started',
    details: 'Issued pilot commencement order for 90-day deployment across 520 km Bengaluru North corridor.',
    status: 'Completed'
  },
  {
    id: 'log-07',
    timestamp: '2026-12-10 15:00:00 IST',
    userRole: 'Department Committee',
    userName: 'Joint Evaluation Board (PWD)',
    action: 'Pilot Validated & SCALE Authorized',
    details: 'Validated score 91/100. KPIs exceeded: 94.2% detection accuracy vs 90% target. Scale authorized.',
    status: 'Completed'
  },
  {
    id: 'log-08',
    timestamp: '2026-12-15 11:15:30 IST',
    userRole: 'Procurement Officer',
    userName: 'Finance & Accounts Division',
    action: 'Procurement Contract Executed',
    details: 'Contract value ₹38.5L issued under GeM Startup Fast-Track. Milestone 1 released.',
    status: 'Completed'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Startup Application Received',
    message: 'RoadVision AI submitted an application for "AI-Based Pothole Detection".',
    time: '2 hours ago',
    read: false,
    type: 'application'
  },
  {
    id: 'notif-2',
    title: 'Pilot KPI Target Achieved',
    message: 'RoadVision AI achieved 94.2% detection accuracy (target was ≥ 90%).',
    time: '5 hours ago',
    read: false,
    type: 'pilot'
  },
  {
    id: 'notif-3',
    title: 'Expert Evaluation Completed',
    message: 'Dr. Arvind Swaminathan submitted score 91/100 recommending pilot shortlist.',
    time: '1 day ago',
    read: false,
    type: 'evaluation'
  },
  {
    id: 'notif-4',
    title: 'Pilot Validation Completed',
    message: 'Joint Committee approved recommendation: SCALE for Bengaluru North road network.',
    time: '2 days ago',
    read: true,
    type: 'validation'
  },
  {
    id: 'notif-5',
    title: 'Procurement Milestone 1 Released',
    message: 'Disbursement of ₹11,55,000 approved following hardware delivery verification.',
    time: '3 days ago',
    read: true,
    type: 'procurement'
  }
];

export const AI_CHALLENGE_TEMPLATES = [
  {
    prompt: "We need a better way to identify potholes and prioritize road repairs.",
    generated: {
      title: "AI-Based Pothole Detection and Road Condition Monitoring",
      department: "Public Works Department",
      category: "Smart Infrastructure",
      techArea: ["Computer Vision", "Edge AI", "GIS Mapping"],
      budgetRange: "₹35 - 50 Lakhs",
      pilotDuration: "90 Days",
      currentSituation: "Manual road surveys cover under 15% of arterial roads monthly with subjective severity grading.",
      problemDescription: "Deploy vehicle-mounted optical cameras and edge-AI algorithms to continuously log road surface damage, calculate roughness index (IRI), and trigger automated geo-tagged repair tickets.",
      targetOutcome: "Comprehensive weekly surface audit across 500+ km of roadways with automated repair prioritization.",
      suggestedKpis: [
        { name: "Detection Accuracy", target: "≥ 90%" },
        { name: "False Positive Rate", target: "≤ 10%" },
        { name: "Average Detection Time", target: "≤ 5 seconds" },
        { name: "Network Road Coverage", target: "≥ 80%" }
      ],
      pilotScope: "Deploy 12 edge camera units on regular municipal inspection vehicles covering 500 km of city corridors over 90 days.",
      eligibilityRequirements: [
        "DPIIT Registered Startup (Age < 7 years)",
        "Demonstrated proprietary Computer Vision / Edge AI capability",
        "Prior field pilot or PoC with municipal/state agency"
      ],
      evaluationCriteria: [
        { name: "Technical Capability & Edge Latency", weight: 25 },
        { name: "Innovation & All-Weather Robustness", weight: 20 },
        { name: "Scalability & GIS Integration", weight: 20 },
        { name: "Cost Effectiveness per KM Scanned", weight: 15 },
        { name: "Public Impact & Road Safety", weight: 20 }
      ]
    }
  },
  {
    prompt: "Farmers suffer heavy crop loss from sudden pest attacks. Need early warning system.",
    generated: {
      title: "Autonomous Multispectral Drone Pest Early-Warning Grid",
      department: "Department of Agriculture",
      category: "Agritech & Food Security",
      techArea: ["Drone AI", "Hyperspectral Vision", "Agri-Analytics"],
      budgetRange: "₹40 - 65 Lakhs",
      pilotDuration: "120 Days",
      currentSituation: "Farmers identify pests only when foliage damage is visible, resulting in excessive pesticide use.",
      problemDescription: "Implement automated drone scouting flights with canopy spectral anomaly algorithms to identify early pest colonies before visible infestation.",
      targetOutcome: "Provide automated 7-day advance pest alerts to 10,000+ farmers via SMS and WhatsApp.",
      suggestedKpis: [
        { name: "Infestation Recall", target: "≥ 88%" },
        { name: "False Alarm Rate", target: "≤ 12%" },
        { name: "Advisory Turnaround", target: "≤ 12 hours" }
      ],
      pilotScope: "Scout 2,000 hectares across 15 villages for 120 days using DGCA certified drone fleet.",
      eligibilityRequirements: [
        "DPIIT Registered Startup",
        "DGCA Drone Certification",
        "Vernacular Farmer Advisory Interface"
      ],
      evaluationCriteria: [
        { name: "Spectral Accuracy", weight: 30 },
        { name: "Field Scalability", weight: 25 },
        { name: "Smallholder Farmer Impact", weight: 25 },
        { name: "Cost per Acre", weight: 20 }
      ]
    }
  },
  {
    prompt: "Smart traffic management using AI sensors for urban congestion",
    generated: {
      title: "AI-Powered Real-Time Urban Traffic Congestion Management & Adaptive Signal Control System",
      department: "Municipal Corporation & Traffic Police Department",
      category: "Urban Mobility",
      techArea: ["Computer Vision", "Edge AI", "IoT Sensors", "Reinforcement Learning", "Traffic Flow Modeling"],
      budgetRange: "₹45 - 60 Lakhs",
      pilotDuration: "120 Days",
      currentSituation: "Urban intersections rely on static timer-based signal cycles or manual police intervention. This static timing fails during sudden traffic surges, causing excessive vehicle idling, high fuel wastage, and emergency vehicle delays.",
      problemDescription: "Deploy intelligent edge-AI camera and radar sensor networks that dynamically detect vehicle queue lengths, calculate multimodal traffic density, and adjust signal green-times in sub-second latency while prioritizing emergency ambulances.",
      targetOutcome: "Reduce peak-hour corridor commute times by ≥ 25%, ensure 100% emergency vehicle green-wave preemption, and cut intersection idling emissions by 20%.",
      suggestedKpis: [
        { name: "Reduction in Peak-Hour Corridor Delay", target: "≥ 25%", unit: "%" },
        { name: "Emergency Vehicle Preemption Success", target: "100%", unit: "%" },
        { name: "Vehicle Classification Accuracy under Mixed Traffic", target: "≥ 92%", unit: "%" },
        { name: "Edge-to-Signal Controller Latency", target: "≤ 2", unit: "sec" }
      ],
      pilotScope: "Deploy edge-AI camera sensors and adaptive signal controllers across 6 consecutive high-traffic intersections along a 4 km urban corridor integrated with the city command center (ICCC).",
      eligibilityRequirements: [
        "DPIIT Registered Startup (Age < 7 years)",
        "Demonstrated proprietary Computer Vision / Edge AI capability for Indian mixed traffic",
        "Ability to interface with SCATS/CoTCS or standard ITMS signal controllers",
        "Local fail-safe fallback to fixed cycles during power/network interruption"
      ],
      evaluationCriteria: [
        { name: "Technical Capability & Core Innovation", weight: 25 },
        { name: "Field Feasibility & Indian Mixed Traffic Robustness", weight: 20 },
        { name: "Scalability & State IT/GIS Integration", weight: 20 },
        { name: "Cost Effectiveness per Unit Outcome", weight: 15 },
        { name: "Public Impact & Citizen Benefit", weight: 20 }
      ]
    }
  },
  {
    prompt: "Municipal water distribution suffers 35% non-revenue water loss from underground pipeline leakages.",
    generated: {
      title: "IoT Edge Acoustic Sensing & GIS Digital Twin for Underground Water Leakage Localization",
      department: "Ministry of Jal Shakti / Municipal Water Board",
      category: "Water Management",
      techArea: ["Acoustic IoT Sensors", "LoRaWAN", "Digital Twin", "Fast Fourier Transform AI", "GIS Hydro-Mapping"],
      budgetRange: "₹40 - 55 Lakhs",
      pilotDuration: "90 Days",
      currentSituation: "Underground pipe bursts and pinhole leaks remain undetected for months until surface subsidence occurs, wasting up to 35% treated municipal drinking water.",
      problemDescription: "Clamp-on IoT acoustic micro-sensors transmitting vibration harmonics via LoRaWAN to detect pressurized pipeline cavitation and localize hidden underground leaks within 2 meters.",
      targetOutcome: "Reduce non-revenue water (NRW) loss by ≥ 18% across the pilot sector and identify hidden leaks within 48 hours of occurrence.",
      suggestedKpis: [
        { name: "Leak Localization Precision", target: "≤ 2 meters", unit: "m" },
        { name: "Reduction in Non-Revenue Water Loss", target: "≥ 18%", unit: "%" },
        { name: "Acoustic Detection Sensitivity", target: "≥ 92%", unit: "%" }
      ],
      pilotScope: "Instrument 25 km of pressurized water distribution pipeline across 2 urban municipal wards with 100 clamp-on acoustic IoT nodes.",
      eligibilityRequirements: [
        "DPIIT Registered Startup",
        "IP in low-power acoustic signal processing",
        "Battery life ≥ 3 years for underground telemetry nodes"
      ],
      evaluationCriteria: [
        { name: "Acoustic Signal Processing Accuracy", weight: 30 },
        { name: "Field Ruggedness & Battery Autonomy", weight: 25 },
        { name: "GIS Platform Integration", weight: 25 },
        { name: "Cost per km Monitored", weight: 20 }
      ]
    }
  }
];

export const INITIAL_IMPACT_RECORDS: ImpactRecord[] = [
  {
    id: 'impact-pwd-01',
    challengeId: 'ch-pwd-01',
    challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
    startupId: 'startup-roadvision',
    startupName: 'RoadVision AI',
    solutionName: 'State-Wide Intelligent Road Health Grid',
    scaleUpPlanId: 'scaleup-pwd-roadvision',
    scaleUpPlanTitle: 'Karnataka State-Wide Intelligent Road Condition & Pothole Monitoring Grid',
    procurementId: 'contract-pwd-0926',
    procurementReferenceId: 'REF-GFR173-0926',
    pilotId: 'pilot-pwd-roadvision',
    reportingPeriod: 'Q1 2027',
    metricName: 'Average Pothole Repair Work Order Dispatch Time',
    impactCategory: 'Time Savings',
    baselineValue: 14,
    currentValue: 2.2,
    targetValue: 2.0,
    unit: 'Days',
    beneficiaryCount: 2100000,
    geographicCoverage: 'Bengaluru Urban & Rural Highway Corridors (4,500 km)',
    implementationStatus: 'Ahead',
    evidence: 'PWD Works Division automated SMS/GIS dispatch audit logs & contractor job sign-offs',
    notes: 'Edge camera AI reduced manual bureaucratic inspection delay by 84.3%, routing work orders directly to nearest asphalt teams.',
    reportedBy: 'Ananya Deshmukh (RoadVision AI)',
    verifiedBy: 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    verificationStatus: 'Verified',
    verificationNotes: 'Independently confirmed via Karnataka PWD e-Pramaan portal telemetry.',
    verifiedAt: '2027-03-31',
    createdAt: '2027-03-25',
    updatedAt: '2027-03-31',
    absoluteChange: -11.8,
    percentageChange: -84.3,
    targetAchievement: 98.3
  },
  {
    id: 'impact-pwd-02',
    challengeId: 'ch-pwd-01',
    challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
    startupId: 'startup-roadvision',
    startupName: 'RoadVision AI',
    solutionName: 'State-Wide Intelligent Road Health Grid',
    scaleUpPlanId: 'scaleup-pwd-roadvision',
    scaleUpPlanTitle: 'Karnataka State-Wide Intelligent Road Condition & Pothole Monitoring Grid',
    procurementId: 'contract-pwd-0926',
    procurementReferenceId: 'REF-GFR173-0926',
    pilotId: 'pilot-pwd-roadvision',
    reportingPeriod: 'Q1 2027',
    metricName: 'Cumulative Manual Road Inspection Expenditure Saved',
    impactCategory: 'Cost Savings',
    baselineValue: 0,
    currentValue: 48.5,
    targetValue: 60.0,
    unit: '₹ Lakhs',
    beneficiaryCount: 2100000,
    geographicCoverage: 'Karnataka State Highway Corridors 1-5',
    implementationStatus: 'On Track',
    evidence: 'Departmental expenditure vouchers and canceled commercial LiDAR rental tenders',
    notes: 'Eliminated external private surveying contractors across 4,500 km.',
    reportedBy: 'Ananya Deshmukh (RoadVision AI)',
    verifiedBy: 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    verificationStatus: 'Verified',
    verificationNotes: 'Certified by PWD Accounts Section and Internal Audit Wing.',
    verifiedAt: '2027-04-05',
    createdAt: '2027-04-01',
    updatedAt: '2027-04-05',
    absoluteChange: 48.5,
    percentageChange: 100.0,
    targetAchievement: 80.8
  },
  {
    id: 'impact-pwd-03',
    challengeId: 'ch-pwd-01',
    challengeTitle: 'AI-Based Pothole Detection and Road Condition Monitoring',
    startupId: 'startup-roadvision',
    startupName: 'RoadVision AI',
    solutionName: 'State-Wide Intelligent Road Health Grid',
    scaleUpPlanId: 'scaleup-pwd-roadvision',
    scaleUpPlanTitle: 'Karnataka State-Wide Intelligent Road Condition & Pothole Monitoring Grid',
    procurementId: 'contract-pwd-0926',
    procurementReferenceId: 'REF-GFR173-0926',
    pilotId: 'pilot-pwd-roadvision',
    reportingPeriod: 'Q2 2027',
    metricName: 'Citizens Directly Benefited via Real-Time Road Hazard Transparency',
    impactCategory: 'Citizen Reach',
    baselineValue: 100000,
    currentValue: 1650000,
    targetValue: 2000000,
    unit: 'Citizens',
    beneficiaryCount: 1650000,
    geographicCoverage: '14 District State Highways',
    implementationStatus: 'On Track',
    evidence: 'Traffic police public portal API query hits and mobile nav alerts sent',
    notes: 'Q2 reporting period telemetry submitted by startup founder; awaiting government officer sign-off.',
    reportedBy: 'Ananya Deshmukh (RoadVision AI)',
    verificationStatus: 'Pending Verification',
    createdAt: '2027-06-15',
    updatedAt: '2027-06-15',
    absoluteChange: 1550000,
    percentageChange: 1550.0,
    targetAchievement: 81.6
  }
];

export function calculateImpactMetrics(baseline: number, current: number, target: number) {
  const b = Number(baseline) || 0;
  const c = Number(current) || 0;
  const t = Number(target) || 0;

  const absoluteChange = c - b;

  let percentageChange = 0;
  if (b !== 0) {
    percentageChange = ((c - b) / Math.abs(b)) * 100;
  } else if (c !== 0) {
    percentageChange = c > 0 ? 100 : -100;
  }

  let targetAchievement = 0;
  const targetDiff = t - b;
  const currentDiff = c - b;

  if (targetDiff === 0) {
    targetAchievement = c >= t ? 100 : 0;
  } else if (targetDiff > 0) {
    // Normal case (increase desired)
    targetAchievement = (currentDiff / targetDiff) * 100;
  } else {
    // Inverted case (reduction desired, e.g. delay 14 days down to 2 days)
    targetAchievement = (currentDiff / targetDiff) * 100;
  }

  return {
    absoluteChange: Number(absoluteChange.toFixed(2)),
    percentageChange: Number(percentageChange.toFixed(1)),
    targetAchievement: Number(Math.max(0, targetAchievement).toFixed(1))
  };
}

