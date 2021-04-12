// file is currently being used to test my DB functions

const data = require("./data");
const postData = data.posts;

async function main() {
  console.log("Getting all posts");
  console.log(await postData.getAllPosts());
  console.log("Getting post by ID");
  console.log(await postData.getPostById("606f05f5cba5cb48b03f2abc"));
  console.log("Still waiting ot test get friend posts");
}

main();
