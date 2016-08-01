import * as express from 'express';
import { RedeployController } from '../controllers/redploy.controller';

let router: express.Router = express.Router();

router.get('/redeploy/:name', RedeployController.run);