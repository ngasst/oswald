import * as express from 'express';
import { RedeployController } from '../controllers/redeploy.controller';

let router: express.Router = express.Router();

router.get('/redeploy/:repo/:service/:compose', RedeployController.run);


export let routes = router;