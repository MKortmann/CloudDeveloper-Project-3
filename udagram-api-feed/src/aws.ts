import AWS = require('aws-sdk');
import {config} from './config/config';


// if it is already deployed, the machine is running inside of your instance. So, you do not need to get the credentials!
if(config.aws_profile !== "DEPLOYED") {
  //Configure AWS - it get your credentials setup in your home folder .aws
  var credentials = new AWS.SharedIniFileCredentials({profile: config.aws_profile});
  // we get the credentials above and saved these
  // within the AWS config credentials parameter of that service.
  // the credentials are: aws_access_key_id annd
  // aws_secret_access_key
  AWS.config.credentials = credentials;
}

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: {Bucket: config.aws_media_bucket},
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
