FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Start the dev server and bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]