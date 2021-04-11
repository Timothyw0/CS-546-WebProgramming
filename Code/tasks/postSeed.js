const connection = require("../config/mongoConnection");
let { ObjectId } = require("mongodb");

const main = async () => {
  const db = await connection();
  try {
    await db.collection("post").dropCollection();
  } catch (e) {}
  // Start seeding
  const postCollection = await db.collection("post");
  /* 
    POST Collection:
    _id (ObjectID)
    creator (ObjectID)
    likes ([ObjectIDs])
    recipe (ObjectID) -- Optional
    text (String)
  */

  const makePost = function (id, creator, recipe = null, text) {
    // creator and recipe must be an ObjectID
    return {
      _id: id,
      creator: creator,
      likes: [],
      recipe: recipe,
      text: text,
    };
  };

  // Add userID to post likes array
  // userID must be an ObjectID
  const addLike = function (post, userID) {
    post.likes.push(userID);
  };

  const listOfPosts = [];

  // Tim's post with recipe
  const timPost = makePost(
    (id = ObjectId("606f04246c785b72ecce993f")),
    (creator = "TODO: Tim's ID"),
    (recipe = "TODO: Recipe ID"),
    (text =
      "Omg this new recipe knocked my socks off!! It brings out the underlying tones of tequila extremely well and doesn't have any of the sting! 10/10")
  );
  // Add some likes to Tim's post
  addLike(timPost, "TODO: Patrick's ID");
  addLike(timPost, "TODO: Avani's ID");
  listOfPosts.push(timPost);

  // Kishan's post without recipe
  const kishanPost = makePost(
    (id = ObjectId("606f04cf30078a027490273e")),
    (creator = "TODO: Kishan's ID"),
    (text =
      "The weather is beautiful today and I am thinking of drinking a sweet cocktail. Any recommendations?")
  );
  // Add some likes to Kishan's post
  addLike(kishanPost, "TODO: Billy's ID");
  addLike(kishanPost, "TODO: Tim's ID");
  listOfPosts.push(kishanPost);

  // Billy's post with recipe
  const billyPost = makePost(
    (id = ObjectId("606f054262b48cb2e8dc5af7")),
    (creator = "TODO: Billy's ID"),
    (recipe = "TODO: Billy's Recipe"),
    (text =
      "Check out this new recipe I made with gin! It's perfect for a nice sunny day like today!")
  );
  // Add some likes to Billy's post
  addLike(billyPost, "TODO: Billy's ID");
  addLike(billyPost, "TODO: Tim's ID");
  addLike(billyPost, "TODO: Avani's ID");
  listOfPosts.push(billyPost);

  // Patrick's post without recipe
  const patrickPost = makePost(
    (id = ObjectId("606f05bb4e7e233e61f8beb7")),
    (creator = "TODO: Patrick's ID"),
    (text =
      "What's everyone's favorite spirit? I'm thinking about trying something new")
  );
  // Add some likes to Patrick's's post
  addLike(patrickPost, "TODO: Kishan's ID");
  addLike(patrickPost, "TODO: Avani's ID");
  listOfPosts.push(patrickPost);

  // Avani's post with recipe
  const avaniPost = makePost(
    (id = ObjectId("606f05f5cba5cb48b03f2abc")),
    (creator = "TODO: Avani's ID"),
    (recipe = "TODO: Avani's recipe"),
    (text =
      "I ordered this drink by accident at the bar one time and have been in love with it ever since. Check it out and let me know what you all think!")
  );
  // Add some likes to Avani's post
  addLike(avaniPost, "TODO: Kishan's ID");
  addLike(avaniPost, "TODO: Tim's ID");
  addLike(avaniPost, "TODO: Patrick's ID");
  listOfPosts.push(avaniPost);

  console.log(listOfPosts);

  await postCollection.insertMany(listOfPosts);

  console.log("Done seeding Post collection in database");
  await db.serverConfig.close();
};

main().catch(console.log);
