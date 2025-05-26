# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 3200

# Run backend
CMD ["npm", "run", "start"]
