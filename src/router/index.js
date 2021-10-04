import { Router } from 'express';
import metainfo from '../middleware/metainfo/index.js';
import schedule from '../middleware/schedule/index.js';

const router = Router();

router.route('/metainfo')
  .get(
    // metainfo.isValid,
    metainfo.controller,
  );

router.route('/schedule')
  .get(
    // schedule.isValid,
    schedule.controller,
  );

export default router;
