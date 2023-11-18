# Starting docker image.
FROM node:18.18.2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . /usr/src/app
# We expose the 8000 port.
EXPOSE 8000

# We add the available commands.
CMD ["npm", "run", "dev"]