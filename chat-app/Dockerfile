# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# First, build chat-component
WORKDIR /app/chat-component
COPY chat-component/package*.json ./
RUN npm ci
COPY chat-component .
RUN npm run build
# Create a global symlink for the package
RUN npm link

# Then build chat-app
WORKDIR /app/chat-app
COPY chat-app/package*.json ./
RUN npm ci
# Use the linked package
RUN npm link @entirely/react-chat-component

COPY chat-app .
# Ensure the build script can find the linked package
ENV NODE_PATH=/usr/local/lib/node_modules
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/chat-app/dist ./dist

# Expose port
EXPOSE 5173

# Start the app
CMD ["serve", "-s", "dist", "-l", "5173"]