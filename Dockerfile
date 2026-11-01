FROM node:22-alpine
WORKDIR /app
COPY app.js test.js ./
EXPOSE 3000
CMD ["node", "app.js"]
