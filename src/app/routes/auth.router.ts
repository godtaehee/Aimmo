import express, { Request, Response, Router, NextFunction } from 'express';
import { AuthController } from '../controller/auth.controller';

const router: Router = express.Router();
const controller: AuthController = new AuthController();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    await controller.signup(req, res, next);
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    await controller.login(req, res, next);
});

router.get('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    await controller.refresh(req, res, next);
})

router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
    await controller.logout(req, res, next);
})

export const authRouter: Router = router;