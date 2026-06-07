import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiPlus, FiX, FiArrowRight, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Chest Pain', 'Back Pain',
    'Stomach Pain', 'Nausea', 'Fatigue', 'Dizziness', 'Skin Rash',
    'Sore Throat', 'Joint Pain', 'Anxiety', 'Insomnia', 'Shortness of Breath'
  ];

  const addSymptom = (symptom) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await axios.post('/api/ai/symptom-checker', {
        symptoms,
        additionalInfo
      });
      setResult(response.data.data);
      setStep(2);
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetChecker = () => {
    setSymptoms([]);
    setCurrentSymptom('');
    setAdditionalInfo('');
    setResult(null);
    setStep(1);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'semi-urgent': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiActivity className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          AI <span className="text-gradient">Symptom Checker</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Describe your symptoms and our AI will analyze them to suggest the right specialist for you. 
          This is not a medical diagnosis.
        </p>
      </div>

      {step === 1 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-6">Tell us about your symptoms</h2>

          {/* Symptom Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Add your symptoms
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSymptom(currentSymptom)}
                className="input-field flex-1"
                placeholder="Type a symptom and press Enter"
              />
              <button
                onClick={() => addSymptom(currentSymptom)}
                className="btn-primary flex items-center"
              >
                <FiPlus className="mr-1" /> Add
              </button>
            </div>
          </div>

          {/* Common Symptoms */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Common symptoms (click to add)
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => addSymptom(symptom)}
                  disabled={symptoms.includes(symptom)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    symptoms.includes(symptom)
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Symptoms */}
          {symptoms.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Your symptoms ({symptoms.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full text-sm"
                  >
                    {symptom}
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="ml-2 hover:text-red-600"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Additional information (optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Any other relevant information like duration, severity, medications..."
            />
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Medical Disclaimer:</strong> This tool provides general suggestions based on 
                symptoms and is not a substitute for professional medical advice, diagnosis, or treatment. 
                In case of emergency, call your local emergency services immediately.
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={symptoms.length === 0 || isAnalyzing}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <FiActivity className="w-5 h-5" />
                <span>Analyze Symptoms</span>
              </>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Analysis Result */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <button onClick={resetChecker} className="text-sm text-blue-600 hover:underline">
                Start New Check
              </button>
            </div>

            <div className="space-y-6">
              {/* Urgency Banner */}
              <div className={`rounded-lg p-4 ${getUrgencyColor(result.urgency)}`}>
                <div className="flex items-center space-x-3">
                  {result.urgency === 'urgent' ? (
                    <FiAlertCircle className="w-6 h-6" />
                  ) : (
                    <FiInfo className="w-6 h-6" />
                  )}
                  <div>
                    <p className="font-semibold capitalize">{result.urgency}</p>
                    <p className="text-sm">{result.urgencyMessage}</p>
                  </div>
                </div>
              </div>

              {/* Primary Recommendation */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommended Specialist</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {result.analysis.primarySpecialization}
                  </p>
                  {result.analysis.secondarySpecializations?.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Also consider: {result.analysis.secondarySpecializations.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Possible Conditions */}
              {result.analysis.possibleConditions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Possible Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.possibleConditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * These are suggestions based on symptoms. Please consult a doctor for accurate diagnosis.
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {result.analysis.additionalRecommendations?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Self-Care Recommendations</h3>
                  <ul className="space-y-2">
                    {result.analysis.additionalRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Doctors */}
          {result.recommendedDoctors?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Available {result.analysis.primarySpecialization}s
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {result.recommendedDoctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    whileHover={{ y: -3 }}
                    className="card flex items-center space-x-4"
                  >
                    <img
                      src={doctor.user?.avatar?.url || `https://ui-avatars.com/api/?name=${doctor.user?.name}&size=60&background=random`}
                      alt={doctor.user?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{doctor.user?.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialization}</p>
                      <div className="flex items-center mt-1">
                        <FiStar className="text-yellow-400 fill-current w-3 h-3" />
                        <span className="text-sm ml-1">{doctor.averageRating?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gradient">₹{doctor.consultationFee}</p>
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="text-sm text-blue-600 hover:underline mt-1 block"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link
                  to={`/doctors?specialization=${result.analysis.primarySpecialization}`}
                  className="btn-primary inline-flex items-center"
                >
                  View All {result.analysis.primarySpecialization}s
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SymptomChecker;