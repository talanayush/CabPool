# --- FRONTEND SETUP ---
FROM node:18-alpine AS frontend-build

# Set working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the frontend files
COPY frontend ./

# Build the frontend
RUN npm run build

# --- BACKEND SETUP ---
FROM node:18-alpine AS backend

# Set working directory
WORKDIR /backend

# Copy package.json and package-lock.json
COPY backend/package.json backend/package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy backend source code
COPY backend ./

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "index.js"]

# --- FINAL IMAGE FOR SERVING FRONTEND ---
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy built frontend assets from frontend-build stage
COPY --from=frontend-build /frontend/dist ./

# Expose frontend port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

