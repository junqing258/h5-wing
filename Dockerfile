FROM node:12

# Create app directory
WORKDIR /usr/app/website
COPY ./package*.json ./
RUN npm install -qy
EXPOSE 8080
RUN npm run build
COPY dist/ ./
