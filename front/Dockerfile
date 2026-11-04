FROM node:20-slim
WORKDIR /app
COPY . .
RUN rm -rf node_modules package-lock.json .next && npm install --include=dev && chmod -R +x node_modules/.bin && npm run build
EXPOSE 3000
CMD ["npm", "start"]
