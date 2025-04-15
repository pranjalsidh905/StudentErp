# Step 1: Base image
FROM node:18

# Step 2: Create app directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of your code
COPY . .

# Step 5: Expose port and run the app
EXPOSE 5000
CMD ["npm", "start"]
