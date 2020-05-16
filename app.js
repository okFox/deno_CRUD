import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

const env = Deno.env.toObject();
const PORT = env.PORT || 7890;
const HOST = env.HOST || '127.0.0.1';

let cats = [
  {
    name: 'Garfield',
    age: 33
  },
  {
    name: 'Heathcliff',
    age: 8
  },
  {
    name: 'Whiskey',
    age: 19
  }
];

// @ts-ignore
export const getCats = ({ response }) => response.body = cats;

// @ts-ignore
export const getCat = ({ params, response }) => {
  const cat = cats.filter(cat => cat.name.toLowerCase() === params.name.toLowerCase());
  if(cat.length) {
    response.status = 200
    response.body = cat[0]
    return
  }
  response.status = 400;
  response.body = {msg: `Not found.  No ${params.name} for you!`};
}

//still need async keyword within functions
// @ts-ignore
export const addCat = async ({ request, response }) => {
  const body = await request.body();
  const cat = body.value;
  cats.push(cat);

  response.body = { msg: 'ok' };
  response.status = 200;
}

// @ts-ignore
export const updateCat = async ({ params, request, response }) => {
  const temp = cats.filter((existingCat) => existingCat.name.toLowerCase() === params.name.toLowerCase());
  const body = await request.body();
  const { age } = body.value;
  // console.log(age);

  if( temp.length ) {
    temp[0].age = age
    response.status = 200
    response.body = { msg: `${params.name}'s age is now ${age}`}
    return
  }

  response.status = 400;
  response.body = { msg: `cannot find ${params.name}`};
};




const router = new Router();
router
  // @ts-ignore
  .get('/cats', getCats)
  .get('/cats/:name', getCat)
  .post('/cats', addCat)
  .put('/cats/:name', updateCat);
  // .delete('/cats/:name', removeCat)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);


