# Use a base image with Java 17
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from the target directory into the container
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the backend runs on
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
