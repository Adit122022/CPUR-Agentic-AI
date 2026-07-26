import { Router } from 'express';
import { ragController } from '../controllers/ragController';

const router = Router();

router.get('/status', (req, res) => ragController.getStatus(req, res));
router.post('/ingest', (req, res) => ragController.ingestDocument(req, res));
router.post('/query', (req, res) => ragController.queryRag(req, res));
router.post('/upload', (req, res) => ragController.uploadAndIngest(req, res));

export default router;
