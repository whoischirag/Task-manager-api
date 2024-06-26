const request = require("supertest");
const Task = require("../src/models/tasks");
const Test = require("supertest/lib/test");
const app = require("../src/app");
const {
  usertwo,
  usertwoId,
  setupDatabase,
  taskOne,
  taskThree,
  taskTwo,
  userone,
  useroneId,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create a new task for a user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${usertwo.tokens[0].token}`)
    .send({
      description: "from my test",
      Completed: true,
    })
    .expect(200);

  const task = Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test("should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${usertwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(1);
});



test('should not delete task by unauthorised user ',async ()=>{

const response = await request(app).delete(`/tasks/${taskOne._id}`)
.set("Authorization", `Bearer ${usertwo.tokens[0].token}`)
.send()
.expect(404)

const task = Task.findById(taskOne._id)
expect(task).not.toBeNull()

})