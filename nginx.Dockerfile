# Stage 1: Build the Angular application
FROM node:20 AS build-stage
WORKDIR /app
COPY front/package.json ./
RUN npm install
COPY front/ ./
COPY ./nginx.conf /app/nginx.conf
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the built assets from the build stage
COPY --from=build-stage /app/dist/front/browser /usr/share/nginx/html
# Copy custom Nginx configuration
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]