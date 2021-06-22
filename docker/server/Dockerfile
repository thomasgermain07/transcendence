FROM node:14-alpine

RUN apk add --update --no-cache postgresql-dev

RUN yarn global add @nestjs/cli

WORKDIR /workspace

VOLUME ["/workspace", "/workspace/node_modules"]

COPY server.sh	/usr/local/bin/server.sh
RUN  chmod +x	/usr/local/bin/server.sh
ENTRYPOINT ["server.sh"]

EXPOSE 8080
