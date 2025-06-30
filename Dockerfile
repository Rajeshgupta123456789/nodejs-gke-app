# Use official Node.js LTS image as base
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the app source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to start your app
CMD ["node", "server.js"]
