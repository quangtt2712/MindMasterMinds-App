# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install -g expo-cli @expo/ngrok
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that Expo uses
EXPOSE 19000 19001 19002

# Start the Expo project
CMD ["npx", "expo", "start", "--tunnel"]
