# 42 - Transcendence

---
## Notes
- Move __/docker/.env.template__ into __.env__
- Set __FT_ID__ and __FT_SECRET__ in __.env__ _(42 API OAuth2)_

---
## Commands
- Start project :
```
docker-compose up [--build]
```
- Set permissions _(because docker runs as __root__)_ :
```
sudo chown -R $USER:$USER www/
```
- Open a terminal :
```
docker-compose exec [client, server] sh
```

---
## Docs
- https://en.wikipedia.org/wiki/Singlepage_application
- https://api.intra.42.fr/apidoc/guides/getting_started

### NestJS
- https://nestjs.com

### Vue 3
- https://v3.vuejs.org/

### Socket
- https://socket.io/

### Authentication
- https://github.com/jaredhanson/passport

---
## Helper

---
## History
- Reset projet :
```
sudo rm -rf db && mkdir www
```
- Generate app :
```
docker-compose run --no-deps server nest new server --skip-git
docker-compose run --no-deps client yarn create @vite/app .
```
