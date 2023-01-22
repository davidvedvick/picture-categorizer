FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /workspace/app
COPY . .

RUN --mount=type=cache,target=/root/.gradle ./gradlew assemble build buildFatJar
RUN cd build/libs; cp *-all.jar catpics.jar

FROM scratch AS staging
ARG DEPENDENCY=/workspace/app/build/libs/catpics.jar
COPY --from=build ${DEPENDENCY} /

FROM eclipse-temurin:8-jdk-alpine
VOLUME /tmp
COPY --from=staging / /app
ENTRYPOINT ["java","-jar","/app/catpics.jar"]