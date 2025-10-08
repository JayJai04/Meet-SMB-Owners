# Use the official Node.js LTS Alpine image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
# This step is crucial for Docker layer caching. Copying these first
# means Docker only needs to re-run npm install if these files change.
COPY package*.json ./

# Install app dependencies
# Use 'npm ci' for faster, more reliable installs in CI/CD and production
# For local development, 'npm install' is fine.
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]