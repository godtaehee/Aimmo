import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { authRouter } from './auth.router';
import { postRouter } from './post.router';
import { pageRouter } from './page.router';

const router: Router = express.Router();
const swaggerSpec = YAML.load(path.join(__dirname, '../../../build/swagger.yaml'))
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
router.use('/auth', authRouter);
router.use('/post', postRouter);
// router.use('/page', pageRouter);
export const applicationRouter: Router = router;
