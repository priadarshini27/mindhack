FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/level-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8052
ENTRYPOINT ["java", "-jar", "app.jar"]
