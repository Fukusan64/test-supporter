import p           from 'path';
import fs          from 'fs';
import dt          from 'directory-tree';
import marked      from 'marked';
import highlightjs from 'highlight.js';
import yamlParser  from '../helpers/clipYamlToData.mjs';

export default class Storage {

  constructor(basePath = p.resolve()) {
    Object.assign(this, {basePath});
  }

  async middlewar(ctx, next) {
    ctx.assert(ctx.path.indexOf('..') === -1, 403, 'can not open it');
    const obj = dt(p.join(this.basePath, ctx.path));
    ctx.assert(obj !== null, 404, 'Not Found');
    ctx.state.obj = obj;
    return await next();
  }

  async show(ctx, next) {
    const {name, path, children: allChildren, type} = ctx.state.obj;

    if (type === 'directory') {
      const children = allChildren.filter(({ name }) => !/^\./.test(name));
      await ctx.render('directory', {
        path,
        children,
        name,
        url: ctx.path,
        pearent: p.dirname(ctx.path)
      });
    } else if (type === 'file') {
      if (/\.md$/.test(name)) {
        await ctx.render('markdown', {
          convertedMd: marked(
            (await fs.promises.readFile(path)).toString(),
            {
              highlight(code, lang) {
                return highlightjs.highlightAuto(code, [lang]).value;
              },
            }
          )
        });
      } else if (/\.clip\.yaml$/.test(name)) {
        const data = yamlParser((await fs.promises.readFile(path)).toString());
        await ctx.render('clip-yaml', {name, path, data, pearent: p.dirname(ctx.path) });
      } else if(/\.(txt|html|js|mjs|css)$/.test(name)) {
        ctx.response.set('content-type', 'txt');
        ctx.body = fs.createReadStream(path);
      } else {
        ctx.throw(403, 'can not open');
      }
    } else {
      ctx.throw(403, 'can not open');
    }
    return await next();
  }
}
