# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock if present
COPY package.json yarn.lock* ./

# Install dependencies with yarn
RUN yarn install --frozen-lockfile || yarn install --no-lockfile

# Copy the rest of the project files
COPY . .

# Set the default command
CMD ["yarn", "start"] 