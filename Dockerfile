# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g nodemon

# Copy the entire app source code into the working directory
COPY . .

RUN npx prisma generate

# Expose port 3000 (default for Next.js)
EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "dev"]
