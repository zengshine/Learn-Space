var Koa = require("koa");
var Router = require("koa-router");

var app = new Koa();
var router = new Router();

router
  .get("/", (ctx, next) => {
    // ctx.router available
  })
  .post("/users", (ctx, next) => {
    // ...
  })
  .put("/users/:id", (ctx, next) => {
    // ...
  })
  .del("/users/:id", (ctx, next) => {
    // ...
  })
  .all("/users/:id", (ctx, next) => {
    // ...
  });

app.use(router.routes()).use(router.allowedMethods());
