# Step 1: Build React App
FROM node:18 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the app
COPY . .
RUN npm run build

# Step 2: Serve build using nginx
FROM nginx:alpine

# Copy build files from previous step
COPY --from=build /app/build /usr/share/nginx/html

# Expose nginx default port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
