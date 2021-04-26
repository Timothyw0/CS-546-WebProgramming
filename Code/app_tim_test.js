// file is currently being used to test my DB functions

const data = require("./data");
const postData = data.posts;

async function main() {
  console.log("Getting all posts");
  console.log(await postData.getAllPosts());
  console.log("Getting post by ID");
  console.log(await postData.getPostById("606f05f5cba5cb48b03f2abc"));
  console.log("Getting friend's posts by ID");
  console.log(await postData.getFriendPosts("607322eb50dc91a9bc14955b"));

  console.log("Inserting a new post");
  const newPost = await postData.addPost(
    "606f04246c785b72ecce993f",
    "",
    "This is Tim's new test post"
  );
  console.log(newPost);

  console.log("Updating a new post");
  console.log(
    await postData.updatePost(newPost._id.toString(), {
      text: "Tim's post has been updated",
    })
  );

  console.log("Adding a like to the new post");
  console.log(
    await postData.addLike(newPost._id.toString(), "607322eb50dc91a9bc14955b")
  );

  console.log("Removing a like to the new post");
  console.log(
    await postData.removeLike(
      newPost._id.toString(),
      "607322eb50dc91a9bc14955b"
    )
  );

  console.log("Removing the post all together");
  console.log(await postData.removePost(newPost._id.toString()));
}

main();
