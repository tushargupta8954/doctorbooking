import express from 'express';
import { checkSymptoms, getHealthTips } from '../controllers/aiController.js';

const router = express.Router();

router.post('/symptom-checker', checkSymptoms);
router.get('/health-tips', getHealthTips);

export default router;