// export const config = {
// 			"username": "udagramdev",
// 			"password": "Samsung2020",
// 			"database": "udagramdev",
// 			"host": "udagramdev.cfpseudia1c8.eu-central-1.rds.amazonaws.com",
// 			"dialect": "postgres",
// 			"aws_region": "eu-central-1",
// 			"aws_profile": "default",
// 			"aws_media_bucket": "udagram-073942986821-dev",
// 			"version": 'v4',
// 			"jwt": {
// 				"secret": "hello"
// 			},
// 			"url": 'http://localhost:8100'
// }
export const config = {
			"username": process.env.POSTGRESS_USERNAME,
			"password": process.env.POSTGRESS_PASSWORD,
			"database": process.env.POSTGRESS_DATABASE,
			"host": process.env.POSTGRESS_HOST,
			"dialect": "postgres",
			"aws_region": process.env.AWS_REGION,
			"aws_profile": process.env.AWS_PROFILE,
			"aws_media_bucket": process.env.AWS_MEDIA_BUCKET,
			"version": 'v4',
			"jwt": {
				"secret": process.env.JWT_SECRET
			},
			"url": 'http://localhost:8100'
}