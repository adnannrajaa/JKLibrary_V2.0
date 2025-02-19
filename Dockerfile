
# Use Node.js 18.19+ as the base image
FROM node:22.4.1 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli@18.1.0
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN ng build --configuration=production

# Use NGINX to serve the Angular app
FROM nginx:alpine

# Remove the default NGINX static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular build output to NGINX's root folder
COPY --from=build /app/dist/jklibrary-v2.0  /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
