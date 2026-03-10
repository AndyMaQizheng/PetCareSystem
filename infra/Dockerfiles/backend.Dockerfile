# syntax=docker/dockerfile:1.7-labs
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY backend ./backend
WORKDIR /workspace/backend
RUN chmod +x gradlew && ./gradlew clean bootJar --no-daemon

FROM eclipse-temurin:21-jre
ENV SPRING_PROFILES_ACTIVE=prod \
    SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JAVA_OPTS=""
WORKDIR /app
COPY --from=build /workspace/backend/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
