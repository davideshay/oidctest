# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Health check
#HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#  CMD node -e "const http = require('http'); \
#  const options = { hostname: 'localhost', port: 3000, path: '/health', method: 'GET' }; \
#  const req = http.request(options, (res) => { \
#    if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } \
#  }); \
#  req.on('error', () => { process.exit(1); }); \
#  req.end();"

# Start the application
CMD ["npm", "start"]
