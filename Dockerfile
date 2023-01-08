FROM node:16.17.1
WORKDIR /opt/app
ADD package.json package.json
RUN npm install --legacy-peer-deps
ADD . .
RUN npm run build
CMD ["node", "./dist/main.js"]
