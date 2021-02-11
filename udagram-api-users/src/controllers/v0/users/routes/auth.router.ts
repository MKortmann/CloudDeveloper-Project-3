import {Router, Request, Response} from 'express';

import {User} from '../models/User';
import * as c from '../../../../config/config';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {NextFunction} from 'connect';

import * as EmailValidator from 'email-validator';
import {config} from 'bluebird';

const router: Router = Router();


async function generatePassword(plainTextPassword: string): Promise<string> {
  //Use Bcrypt to Generated Salted Hashed Passwords
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainTextPassword, salt);
}

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
  //Use Bcrypt to Compare your password to your Salted Hashed Passwo
  return await bcrypt.compare(plainTextPassword, hash);
}

// generate our JWT
function generateJWT(user: User): string {
  return jwt.sign(user.short(), c.config.jwt.secret);
}

// so, if we do not have an authorization we will return and the next function will not
// be called - this is a middleware function that we need also to use the NextFunction lib
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({message: 'No authorization headers.'});
  }

  // the format is bearer kjdlskjfölsdkfj
  //so, we split and later on we store only the token_bearer[1]
  const tokenBearer = req.headers.authorization.split(' ');
  if (tokenBearer.length != 2) {
    return res.status(401).send({message: 'Malformed token.'});
  }

  const token = tokenBearer[1];
  return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({auth: false, message: 'Failed to authenticate.'});
    }
    // we can also pass information here, but in this case we are just continue on down the process
    return next();
  });
}

router.get('/verification',
    requireAuth,
    async (req: Request, res: Response) => {
      return res.status(200).send({auth: true, message: 'Authenticated.'});
    });

// we use post here to allow the user to login! At each new login it will be generate
// a new JWT.
router.post('/login', async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !EmailValidator.validate(email)) {
    return res.status(400).send({auth: false, message: 'Email is required or malformed.'});
  }

  if (!password) {
    return res.status(400).send({auth: false, message: 'Password is required.'});
  }

  const user = await User.findByPk(email);
  if (!user) {
    return res.status(401).send({auth: false, message: 'User was not found..'});
  }

  // check that the password matches
  const authValid = await comparePasswords(password, user.passwordHash);

  if (!authValid) {
    return res.status(401).send({auth: false, message: 'Password was invalid.'});
  }

  const jwt = generateJWT(user);
  res.status(200).send({auth: true, token: jwt, user: user.short()});
});

//register a new user - we just post a new user to our endpoint
//so, if your root is: /api/v0/users/auth/
router.post('/', async (req: Request, res: Response) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;

  if (!email || !EmailValidator.validate(email)) {
    return res.status(400).send({auth: false, message: 'Email is missing or malformed.'});
  }

  if (!plainTextPassword) {
    return res.status(400).send({auth: false, message: 'Password is required.'});
  }

  const user = await User.findByPk(email);
  if (user) {
    return res.status(422).send({auth: false, message: 'User already exists.'});
  }

  const generatedHash = await generatePassword(plainTextPassword);

  // we create a newUser object from sequelize library in accord to the model.
  const newUser = await new User({
    email: email,
    passwordHash: generatedHash,
  });

  // we save it in our database. In our case AWS RDS.
  const savedUser = await newUser.save();


  // so, we saved the user and send back to frontend the JWT.
  const jwt = generateJWT(savedUser);
  res.status(201).send({token: jwt, user: savedUser.short()});
});

router.get('/', async (req: Request, res: Response) => {
  res.send('auth');
});

export const AuthRouter: Router = router;
