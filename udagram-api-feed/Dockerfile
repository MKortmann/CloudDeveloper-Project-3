# Use NodeJS base image
FROM node:13

# CONNECT WITH THE ENVIRONMENT VARIABLES
ARG POSTGRES_USERNAME
ARG POSTGRES_PASSWORD
ARG POSTGRES_HOST
ARG POSTGRES_DB
ARG AWS_BUCKET
ARG AWS_REGION
ARG AWS_PROFILE
ARG JWT_SECRET
ARG URL

# set the environment variables
ENV POSTGRES_USERNAME=${POSTGRES_USERNAME} POSTGRES_PASSWORD=${POSTGRES_PASSWORD} POSTGRES_HOST=${POSTGRES_HOST} POSTGRES_DB=${POSTGRES_DB} AWS_BUCKET=${AWS_BUCKET} AWS_REGION=${AWS_REGION} AWS_PROFILE=${AWS_PROFILE} JWT_SECRET=${JWT_SECRET} URL=${URL}

# Create app directory in Docker
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies in Docker
RUN npm ci

# Copy app from local environment into the Docker image
COPY . .

# Set the API’s port number
EXPOSE 8080

# Define Docker’s behavior when the image is run
CMD ["npm", "run", "dev"]