import Koa        from 'koa';
import accesslog  from 'koa-accesslog';
import Router     from '@koa/router';
import bodyParser from 'koa-bodyparser';
import koaStatic  from 'koa-static';
import render     from 'koa-ejs';
import path       from 'path';
import Storage    from './Controllers/Storage.mjs';

const targetPort = process.argv[2] ?? 3000;

const app = new Koa();
const router = new Router();

render(app, {
  root   : path.join(path.resolve(), 'view'),
  layout : 'template',
  viewExt: 'ejs',
  cache  : false,
  debug  : false,
});

// global middlewares
app.use(accesslog());
app.use(bodyParser());
app.use(koaStatic(path.resolve('./assets')));


router
  .get('', async (ctx) => {
    await ctx.render('top');
  })
;

const storage = new Storage();
router
  .prefix('/storage')
  .use(async (...args) => storage.middlewar(...args))
  .get('(.*)', async (...args) => {
    await storage.show(...args);
  })
;

app.use(router.routes());
app.listen(targetPort);

