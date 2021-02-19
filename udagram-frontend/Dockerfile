# Use Ionic base image so we do not need to install it
FROM beevelop/ionic AS ionic
# Create app directory in Docker
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies in Docker
RUN npm ci

# Copy app from local environment into the Docker image
COPY . .
# Build app
RUN ionic build

## So, here a single DockerFile will be used to generate a new image that includes the necessary content. In this case using an alpine image, then we need the copy command below
FROM nginx:alpine

#COPY  SOURCE: /usr/src/app/www
#      DESTINATION: /usr/share/nginx/html
#USING flag from to set the source location to a previous build stage FROM ... AS <name>. That is used instead of a build context sent by the user.
# so here we copy the "artifacts" that are build in the folder
# /usr/src/app/www from the previous image ionic to the
# usr/share/nginx/html
COPY --from=ionic  /usr/src/app/www /usr/share/nginx/html
