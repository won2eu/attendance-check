FROM gradle:8-jdk-bookworm AS builder

WORKDIR /home/gradle/project

# Copy only the Gradle build files first to take advantage of layer caching for deps
COPY attendance/settings.gradle attendance/build.gradle ./
# Copy source
COPY attendance/ src/attendance/

# Build the Spring Boot fat jar (skip tests for predictable, faster builds in CI)
RUN gradle -p src/attendance clean bootJar --no-daemon -x test --stacktrace

# -- Runtime image --
FROM eclipse-temurin:17-jre-slim-bookworm

# Create a non-root user and app directory
ENV APP_HOME=/app
RUN addgroup --system app && adduser --system --ingroup app app \
    && mkdir -p $APP_HOME && chown app:app $APP_HOME

WORKDIR $APP_HOME

# Copy the jar produced by the builder
# Use a deterministic jar name by selecting the first jar in libs (Spring Boot produces one)
COPY --from=builder /home/gradle/project/src/attendance/build/libs/*.jar ./app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Ensure the application binds to 0.0.0.0 and uses a reasonable memory-friendly JVM baseline.
# Allow overriding JAVA_OPTS at runtime.
ENV JAVA_OPTS="-Dserver.address=0.0.0.0 -Dserver.port=8080 -Xms256m -Xmx512m"

USER app

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
