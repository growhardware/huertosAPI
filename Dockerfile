FROM node:10

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait
RUN mkdir -p /var/app/current

# Copy application sources
COPY . /var/app/current

WORKDIR /var/app/current

RUN npm i

RUN chown -R node:node /var/app/current
USER node

# Set the workdir /var/app/current

EXPOSE 1337

# Start the application
CMD /wait && npm run start