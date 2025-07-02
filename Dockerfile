# # FROM node:18
# # WORKDIR /app
# # COPY . .
# # RUN npm install -g sails && npm install --legacy-peer-deps
# # EXPOSE 3000
# # CMD ["sails", "lift"]

# FROM node:18

# WORKDIR /app

# COPY package*.json ./

# RUN npm install -g sails
# RUN npm install mqtt --save
# RUN npm install dotenv --save
# RUN npm install --legacy-peer-deps

# COPY . .

# EXPOSE 3000
# ENV NODE_ENV production
# CMD ["sails", "lift"]
# # CMD ["sails", "lift", "--hooks.orm=false"]

FROM node:18

WORKDIR /app

# Copiamos primero package.json para aprovechar cache
COPY package*.json ./

# Instalar sails y dependencias necesarias
RUN npm install -g sails
RUN npm install sails-mongo --save
RUN npm install mqtt dotenv --save
RUN npm install --legacy-peer-deps

# Copiamos el resto del proyecto
COPY . .

# Expone el puerto donde escucha sails (usualmente 1337, pero puede estar remapeado a 3000)
EXPOSE 3000

# Seteamos producción (puede ser sobreescrito en Railway o docker-compose)
ENV NODE_ENV production

# Comando de arranque
CMD ["sails", "lift"]
