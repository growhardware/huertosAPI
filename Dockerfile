FROM node:18
WORKDIR /app
COPY . .
RUN npm install -g sails && npm install
EXPOSE 3000
CMD ["sails", "lift"]