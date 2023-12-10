# Starting docker image.
FROM node:18.18.2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . /usr/src/app

# We expose the 8000 port.
EXPOSE 8000

# We add the available commands.
CMD ["npm", "run", "dev"]