import {Router, Request, Response} from 'express';
import {FeedItem} from '../models/FeedItem';
import {NextFunction} from 'connect';
import * as jwt from 'jsonwebtoken';
import * as AWS from '../../../../aws';
import * as c from '../../../../config/config';

const router: Router = Router();


function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({message: 'No authorization headers.'});
  }

  const tokenBearer = req.headers.authorization.split(' ');
  if (tokenBearer.length != 2) {
    return res.status(401).send({message: 'Malformed token.'});
  }

  const token = tokenBearer[1];
  return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({auth: false, message: 'Failed to authenticate.'});
    }
    return next();
  });
}

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
  // we get our items from the database using sequelize.
  // findAndCountAll method is a convenience method that combines findAll and count.

  const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
   // then we map our data in the db with the signedURL
  items.rows.map((item) => {
    if (item.url) {
      //this is taking our key of the database (item.url)
      //and try to get an url from S3 so we can access that
      //resource directly from our client.
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  res.send(items);
});

// Get a feed resource
//Add an endpoint to GET a specific resource by Primary Key
//We will use the SQL interface to find that record
//We will do some validation to make sure that there is an
//id present, and return that to the user in a sensible data payload.
router.get('/:id',
    async (req: Request, res: Response) => {
      const {id} = req.params;
      const item = await FeedItem.findByPk(id);
      if(!item) {
        return res.status(400).send(`The id is not valid or there is no item with this id`);
    }

    res.status(200).send(item);
    });

// Get a signed url to put a new item in the bucket - so, as soon as I get this url, I can upload a item to the bucket without authorization. This link will be valid in my case, that I set, to 5*60 = 5 minutes.
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
      const {fileName} = req.params;
      const url = AWS.getPutSignedUrl(fileName);
      res.status(201).send({url: url});
    });

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
// requireAuth means that it will be a protect endpoint
// steps: 1) check credentials, 2) check caption and filename, 2) create a FeedItem obj, save in the RDS db, 3) get the signed URL from AWS 4) return this signed URL for the frontend
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
      const caption = req.body.caption;
      const fileName = req.body.url; // same as S3 key name

      // check if the image caption is valid
      if (!caption) {
        return res.status(400).send({message: 'Caption is required or malformed.'});
      }

      // is there a there is a file url
      if (!fileName) {
        return res.status(400).send({message: 'File url is required.'});
      }

      // build the item object of FeedItem (Sequelize ORM - OBJECT)
      const item = await new FeedItem({
        caption: caption,
        url: fileName,
      });

      // we create an sequelize item object called savedItem from the item - it will saved it to the RDS
      const savedItem = await item.save();

      // get the URL to save the image into s3 bucket
      savedItem.url = AWS.getGetSignedUrl(savedItem.url);
      //it will save the data into the RDS using the sequelize ORM
      // return the URL to save the item
      res.status(201).send(savedItem);
    });

export const FeedRouter: Router = router;
