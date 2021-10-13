FROM node:14-alpine
# FROM node:14

RUN apk add --update --no-cache postgresql-dev
# RUN apt-get update && apt-get install -y postgresql postgresql-client

RUN yarn global add @nestjs/cli

WORKDIR /workspace

VOLUME ["/workspace"]

COPY server.sh	/usr/local/bin/server.sh
RUN  chmod +x	/usr/local/bin/server.sh
ENTRYPOINT ["server.sh"]

EXPOSE 8080
