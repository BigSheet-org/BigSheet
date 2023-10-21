# Starting docker image.
FROM node:18.18.2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . /usr/src/app
# We expose the 8080 port.
EXPOSE 8080
# We add the available commands.
CMD ["node", "."]