FROM maven:3.9.14-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -Dmaven.test.skip=true package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/level-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8052
ENTRYPOINT ["java", "-jar", "app.jar"]
