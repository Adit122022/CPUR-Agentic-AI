"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ragController_1 = require("../controllers/ragController");
const router = (0, express_1.Router)();
router.get('/status', (req, res) => ragController_1.ragController.getStatus(req, res));
router.post('/ingest', (req, res) => ragController_1.ragController.ingestDocument(req, res));
router.post('/query', (req, res) => ragController_1.ragController.queryRag(req, res));
router.post('/upload', (req, res) => ragController_1.ragController.uploadAndIngest(req, res));
exports.default = router;
//# sourceMappingURL=api.js.map