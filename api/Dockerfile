# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:20-alpine AS development

# Specify working directory inside container
WORKDIR /khoa/src/app

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./

# Install dependencies inside container
RUN npm install

# Bundle App Sources 
COPY . .

RUN npm run build

EXPOSE 3000

################
## Production ##
################
# Build another image named production
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /khoa/src/app

COPY --from=development /khoa/src/app/ .

EXPOSE 3000

# run app
CMD ["node", "dist/main"]