FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /workspace/app
COPY . .

RUN --mount=type=cache,target=/root/.gradle ./gradlew clean test build
RUN cd build/libs; cp *[!plain].jar catpics.jar

FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/build/libs
COPY --from=build ${DEPENDENCY} /app
ENTRYPOINT ["java","-jar","/app/catpics.jar"]