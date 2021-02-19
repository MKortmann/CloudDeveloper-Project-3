# Use NodeJS base image, tag: alpine
FROM node:15-alpine3.10

# Create app directory in Docker
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies in Docker
# AFTER RUN YOU CAN EXECUTE ANY LINUX COMMAND INSIDE YOUR DOCKER
RUN npm ci

# Copy app from local environment into the Docker image
# COPY command execute on the host (source -> target) to docker
COPY . .

# Set the API’s port number
EXPOSE 8080

# Define Docker’s behavior when the image is run
# entry point command inside a container this is the reason we use CMD instead of RUN. It's a marker command!
CMD ["npm", "run", "prod"]