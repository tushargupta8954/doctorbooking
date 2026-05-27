import Doctor from '../models/Doctor.js';
import ApiResponse from '../utils/apiResponse.js';

const symptomSpecializationMap = {
  'chest pain': { specialization: 'Cardiology', severity: 'high' },
  'heart palpitations': { specialization: 'Cardiology', severity: 'high' },
  'high blood pressure': { specialization: 'Cardiology', severity: 'medium' },
  'shortness of breath': { specialization: 'Cardiology', severity: 'high' },
  'skin rash': { specialization: 'Dermatology', severity: 'low' },
  'acne': { specialization: 'Dermatology', severity: 'low' },
  'eczema': { specialization: 'Dermatology', severity: 'medium' },
  'hair loss': { specialization: 'Dermatology', severity: 'low' },
  'headache': { specialization: 'Neurology', severity: 'medium' },
  'migraine': { specialization: 'Neurology', severity: 'medium' },
  'dizziness': { specialization: 'Neurology', severity: 'medium' },
  'seizure': { specialization: 'Neurology', severity: 'high' },
  'back pain': { specialization: 'Orthopedics', severity: 'medium' },
  'joint pain': { specialization: 'Orthopedics', severity: 'medium' },
  'fracture': { specialization: 'Orthopedics', severity: 'high' },
  'muscle strain': { specialization: 'Orthopedics', severity: 'low' },
  'ear pain': { specialization: 'ENT', severity: 'medium' },
  'sore throat': { specialization: 'ENT', severity: 'low' },
  'sinus': { specialization: 'ENT', severity: 'medium' },
  'hearing loss': { specialization: 'ENT', severity: 'medium' },
  'eye pain': { specialization: 'Ophthalmology', severity: 'medium' },
  'blurred vision': { specialization: 'Ophthalmology', severity: 'high' },
  'eye redness': { specialization: 'Ophthalmology', severity: 'low' },
  'stomach pain': { specialization: 'Gastroenterology', severity: 'medium' },
  'nausea': { specialization: 'Gastroenterology', severity: 'medium' },
  'diarrhea': { specialization: 'Gastroenterology', severity: 'medium' },
  'constipation': { specialization: 'Gastroenterology', severity: 'low' },
  'cough': { specialization: 'Pulmonology', severity: 'medium' },
  'breathing difficulty': { specialization: 'Pulmonology', severity: 'high' },
  'wheezing': { specialization: 'Pulmonology', severity: 'high' },
  'anxiety': { specialization: 'Psychiatry', severity: 'medium' },
  'depression': { specialization: 'Psychiatry', severity: 'medium' },
  'insomnia': { specialization: 'Psychiatry', severity: 'medium' },
  'stress': { specialization: 'Psychiatry', severity: 'low' },
  'toothache': { specialization: 'Dental', severity: 'medium' },
  'gum bleeding': { specialization: 'Dental', severity: 'low' },
  'mouth ulcer': { specialization: 'Dental', severity: 'low' },
  'menstrual pain': { specialization: 'Gynecology', severity: 'medium' },
  'pregnancy': { specialization: 'Gynecology', severity: 'high' },
  'menopause': { specialization: 'Gynecology', severity: 'medium' },
  'child fever': { specialization: 'Pediatrics', severity: 'high' },
  'child growth': { specialization: 'Pediatrics', severity: 'medium' },
  'fever': { specialization: 'General Medicine', severity: 'medium' },
  'fatigue': { specialization: 'General Medicine', severity: 'low' },
  'weight loss': { specialization: 'General Medicine', severity: 'medium' },
  'weight gain': { specialization: 'General Medicine', severity: 'low' }
};

const analyzeSymptoms = (symptoms, additionalInfo) => {
  const matchedSpecializations = new Map();
  let totalSeverity = 0;
  let highestSeverity = 'low';

  symptoms.forEach(symptom => {
    const normalizedSymptom = symptom.toLowerCase().trim();
    
    for (const [key, value] of Object.entries(symptomSpecializationMap)) {
      if (normalizedSymptom.includes(key) || key.includes(normalizedSymptom)) {
        const spec = value.specialization;
        matchedSpecializations.set(spec, (matchedSpecializations.get(spec) || 0) + 1);
        
        if (value.severity === 'high') highestSeverity = 'high';
        else if (value.severity === 'medium' && highestSeverity !== 'high') 
          highestSeverity = 'medium';
        
        totalSeverity += value.severity === 'high' ? 3 : 
                        value.severity === 'medium' ? 2 : 1;
      }
    }
  });

  const sortedSpecializations = Array.from(matchedSpecializations.entries())
    .sort((a, b) => b[1] - a[1]);

  const primarySpecialization = sortedSpecializations[0]?.[0] || 'General Medicine';
  const secondarySpecializations = sortedSpecializations.slice(1, 3).map(s => s[0]);

  let urgency = 'routine';
  let urgencyMessage = 'Your symptoms can be addressed in a routine consultation.';
  
  if (highestSeverity === 'high' || totalSeverity >= 6) {
    urgency = 'urgent';
    urgencyMessage = 'We recommend seeking medical attention within 24-48 hours.';
  } else if (highestSeverity === 'medium' || totalSeverity >= 3) {
    urgency = 'semi-urgent';
    urgencyMessage = 'We recommend scheduling an appointment within the next few days.';
  }

  const possibleConditions = generatePossibleConditions(symptoms, primarySpecialization);

  return {
    primarySpecialization,
    secondarySpecializations,
    urgency,
    urgencyMessage,
    matchedSymptoms: symptoms.length,
    severityLevel: highestSeverity,
    possibleConditions,
    additionalRecommendations: getRecommendations(primarySpecialization)
  };
};

const generatePossibleConditions = (symptoms, specialization) => {
  const conditionMap = {
    'Cardiology': ['Hypertension', 'Angina', 'Arrhythmia'],
    'Dermatology': ['Eczema', 'Psoriasis', 'Contact Dermatitis'],
    'Neurology': ['Migraine', 'Tension Headache', 'Vertigo'],
    'Orthopedics': ['Arthritis', 'Muscle Strain', 'Spinal Issues'],
    'ENT': ['Tonsillitis', 'Sinusitis', 'Otitis Media'],
    'Ophthalmology': ['Conjunctivitis', 'Dry Eye Syndrome', 'Refractive Error'],
    'Gastroenterology': ['Gastritis', 'IBS', 'Acid Reflux'],
    'Pulmonology': ['Bronchitis', 'Asthma', 'COPD'],
    'Psychiatry': ['Anxiety Disorder', 'Depression', 'Sleep Disorder'],
    'General Medicine': ['Viral Infection', 'Bacterial Infection', 'Nutritional Deficiency']
  };

  return conditionMap[specialization] || ['General Health Concern'];
};

const getRecommendations = (specialization) => {
  const recommendations = {
    'Cardiology': [
      'Monitor your blood pressure regularly',
      'Reduce sodium intake',
      'Maintain regular exercise routine'
    ],
    'Dermatology': [
      'Keep skin moisturized',
      'Avoid known allergens',
      'Use sunscreen daily'
    ],
    'Neurology': [
      'Maintain regular sleep schedule',
      'Stay hydrated',
      'Avoid trigger foods'
    ],
    'General Medicine': [
      'Get adequate rest',
      'Stay hydrated',
      'Monitor symptoms'
    ]
  };

  return recommendations[specialization] || [
    'Rest adequately',
    'Stay hydrated',
    'Monitor your symptoms'
  ];
};

const findMatchingDoctors = async (analysis) => {
  const doctors = await Doctor.find({
    specialization: { $regex: analysis.primarySpecialization, $options: 'i' },
    isAvailable: true,
    isVerified: true
  })
    .populate('user', 'name avatar address')
    .sort('-averageRating')
    .limit(5);

  return doctors;
};

export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms, additionalInfo } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return ApiResponse.error(res, 'Please provide symptoms', 400);
    }

    const analysis = analyzeSymptoms(symptoms, additionalInfo);
    const doctors = await findMatchingDoctors(analysis);

    return ApiResponse.success(res, {
      analysis,
      recommendedDoctors: doctors,
      urgency: analysis.urgency,
      message: `Based on your symptoms, we recommend consulting a ${analysis.primarySpecialization}.`
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getHealthTips = async (req, res) => {
  try {
    const { category } = req.query;

    const tips = {
      general: [
        'Drink at least 8 glasses of water daily',
        'Get 7-8 hours of sleep each night',
        'Exercise for at least 30 minutes daily',
        'Eat a balanced diet rich in fruits and vegetables',
        'Practice stress management techniques'
      ],
      heart: [
        'Monitor blood pressure regularly',
        'Limit salt intake',
        'Exercise regularly',
        'Avoid smoking and excessive alcohol',
        'Maintain healthy cholesterol levels'
      ],
      mental: [
        'Practice mindfulness meditation',
        'Take regular breaks from screens',
        'Maintain social connections',
        'Seek professional help when needed',
        'Practice gratitude journaling'
      ],
      fitness: [
        'Start with walking 30 minutes daily',
        'Include strength training twice a week',
        'Stretch before and after exercise',
        'Stay hydrated during workouts',
        'Listen to your body and rest when needed'
      ]
    };

    return ApiResponse.success(res, tips[category] || tips.general);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};