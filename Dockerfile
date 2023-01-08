FROM node:16.17.1
WORKDIR /usr/src/app/
ADD package.json package.json
RUN npm install --legacy-peer-deps
ADD . .
RUN npm run build
RUN npm prune --production --legacy-peer-deps
CMD ["node", "./dist/main.js"]
