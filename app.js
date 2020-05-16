import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

const env = Deno.env.toObject();
const PORT = env.PORT || 7890;
const HOST = env.HOST || '127.0.0.1';

let cats = [
  {
    name: "Garfield",
    age: 33,
  },
  {
    name: "Heathcliff",
    age: 8,
  },
  {
    name: "Whiskey",
    age: 19,
  },
];

export const getCats = ({ response }) => response.body = cats;
export const getCat = ({ params, response }) => {
  const cat = cats.filter(cat => cat.name === params.name);
  if(cat.length) {
    response.status = 200
    response.body = cat[0]
    return
  }
  response.status = 400;
  response.body = {msg: `Not found.  No ${params.name} for you!`};
}



const router = new Router();
router
  .get('/cats', getCats)
  .get('/cats/:name', getCat)
  // .post('/cats', addDog)
  // .put('/cats/:name', updateCat)
  // .delete('/cats/:name', removeCat)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);


