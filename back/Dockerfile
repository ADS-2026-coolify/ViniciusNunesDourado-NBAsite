FROM node:20-slim
WORKDIR /app
COPY . .
RUN rm -rf node_modules package-lock.json dist && npm install --include=dev && chmod -R +x node_modules/.bin && npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
