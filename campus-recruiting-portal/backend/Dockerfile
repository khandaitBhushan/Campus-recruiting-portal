# Stage 1: Build the application
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package jar (skip tests as DB is not reachable during docker build)
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled jar
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

# Default environment variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# JVM Memory Tuning specifically for Render 512MB RAM free/starter instances:
# 1. -Xms128m -Xmx256m: Restricts heap to max 256MB.
# 2. -Xss256k: Reduces thread stack memory by 75% compared to default 1MB.
# 3. -XX:MaxMetaspaceSize=128m: Bounds class metadata memory.
# 4. -XX:ReservedCodeCacheSize=64m: Bounds JIT code cache.
# 5. -XX:+UseSerialGC: Drastically reduces GC metadata & card table overhead (saves ~50-80MB compared to G1GC).
# 6. -XX:+ExitOnOutOfMemoryError: Exits immediately on OOM so container orchestrator restarts cleanly.
ENV JAVA_OPTS="-Xms128m -Xmx256m -Xss256k -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m -XX:+UseSerialGC -XX:+ExitOnOutOfMemoryError"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
