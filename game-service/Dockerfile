FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/game-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8051
ENTRYPOINT ["java", "-jar", "app.jar"]
