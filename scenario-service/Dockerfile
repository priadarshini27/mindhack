FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/scenario-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8053
ENTRYPOINT ["java", "-jar", "app.jar"]
