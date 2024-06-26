const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/users");
const{usertwo,usertwoId,setupDatabase}= require('./fixtures/db')


beforeEach(setupDatabase)

test("should sign up a new User", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "chirag",
      email: "chiragcosde0903@gmail.com",
      password: "gothamcity",
    })
    .expect(200);
  // Assert that the database was changed correctly

  const user = User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //assertion about the response

  expect(response.body).toMatchObject({
    user: {
      name: "chirag",
      email: "chiragcosde0903@gmail.com",
    },

  });
  expect(user.password).not.toBe('gothamcity')
});

test("should login an existing user", async () => {
 const response= await request(app)
    .post("/users/login")
    .send({
      email: usertwo.email,
      password: usertwo.password,
    })
  .expect(200);

  const user = await User.findById(usertwoId)
  expect(response.body.token).toBe(user.tokens[1].token)

  
});

test("should not login ot existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: usertwo.email,
      password: "khuljasimsim",
    })
    .expect(500);
});

test("Should Get Profile For Authenticated User", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${usertwo.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should Get Profile For unauthenticated User", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete the authenticated user ", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${usertwo.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(usertwoId)
    expect(user).toBeNull()
    
});

test("should not delete an unauthenticated user ", async () => {
  await request(app).delete("/users/me").send().expect(401);
});



test('should upload an avatar for user',async ()=>{

await request(app).post('/users/me/avatar')
.set('Authorization',`Bearer ${usertwo.tokens[0].token}`)
.attach('avatar','tests/fixtures/fall.png')
.expect(200)

const user = await User.findById(usertwoId)
expect(user.avatar).toEqual(expect.any(Buffer))


})


test('should update an authorized user ',async ()=>{

await request(app).patch('/users/me')
.set('Authorization',`Bearer ${usertwo.tokens[0].token}`)
.send({
    name:'shivam',

}).expect(200)
const user = await User.findById(usertwoId)
expect(user.name).toEqual('shivam')

})


test('should not update an unauthorized user ',async ()=>{

    await request(app).patch('/users/me')
    .send({
        name:'shivam',
    
    }).expect(401)
    
    })