import * as express from 'express';
import { RedeployController } from '../controllers/redeploy.controller';

let router: express.Router = express.Router();

router.get('/redeploy/:repo/:service/:image/:compose', RedeployController.run);