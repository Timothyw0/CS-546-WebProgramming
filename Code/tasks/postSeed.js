const connection = require("../config/mongoConnection");
let { ObjectId } = require("mongodb");
const users = require("../data/userData");


const main = async () => {
  const db = await connection();
  try {
    await db.dropDatabase();
  } catch (e) {}
  // Start seeding
  const postCollection = await db.collection("post");
  const commentsCollection = await db.collection("comments");
  /* 
    POST Collection:
    _id (ObjectID)
    creator (ObjectID)
    likes ([ObjectIDs])
    recipe (ObjectID) -- Optional
    text (String)
  */

  const makePost = function (id, creator, recipe = "", text) {
    // creator and recipe must be an ObjectID
    return {
      _id: id,
      creator: creator,
      likes: [],
      recipe: recipe,
      text: text,
      date: new Date(),
    };
  };

  const makeComments = function (id, userId, postId, comment) {
    return {
      _id: id,
      userId: userId,
      postId: postId,
      comment: comment,
    };
  };

  // Add userID to post likes array
  // userID must be an ObjectID
  const addLike = function (post, userID) {
    post.likes.push(userID);
  };

  const listOfPosts = [];
  const listOfComments = [];
  // Tim's post with recipe
  const timPost = makePost(
    (id = ObjectId("606f04246c785b72ecce993f")),
    (creator = "607322eb50dc91a9bc14955b"),
    (recipe = "TODO: Recipe ID"),
    (text =
      "Omg this new recipe knocked my socks off!! It brings out the underlying tones of tequila extremely well and doesn't have any of the sting! 10/10")
  );
  // Add some likes to Tim's post
  addLike(timPost, "6073261f162457f64eddacfb");
  addLike(timPost, "60732f6f9344955ba436a1bc");
  listOfPosts.push(timPost);

  // Kishan's post without recipe
  const kishanPost = makePost(
    (id = ObjectId("606f04cf30078a027490273e")),
    (creator = "60732518372d3ae3b871f315"),
    (recipe = ""),
    (text =
      "The weather is beautiful today and I am thinking of drinking a sweet cocktail. Any recommendations?")
  );
  // Add some likes to Kishan's post
  addLike(kishanPost, "60732579ee3a5bd593f2771a");
  addLike(kishanPost, "607322eb50dc91a9bc14955b");
  listOfPosts.push(kishanPost);

  // Billy's post with recipe
  const billyPost = makePost(
    (id = ObjectId("606f054262b48cb2e8dc5af7")),
    (creator = "60732579ee3a5bd593f2771a"),
    (recipe = "TODO: Billy's Recipe"),
    (text =
      "Check out this new recipe I made with gin! It's perfect for a nice sunny day like today!")
  );
  // Add some likes to Billy's post
  addLike(billyPost, "60732579ee3a5bd593f2771a");
  addLike(billyPost, "607322eb50dc91a9bc14955b");
  addLike(billyPost, "60732f6f9344955ba436a1bc");
  listOfPosts.push(billyPost);

  // Patrick's post without recipe
  const patrickPost = makePost(
    (id = ObjectId("606f05bb4e7e233e61f8beb7")),
    (creator = "6073261f162457f64eddacfb"),
    (recipe = ""),
    (text =
      "What's everyone's favorite spirit? I'm thinking about trying something new")
  );
  // Add some likes to Patrick's's post
  addLike(patrickPost, "60732518372d3ae3b871f315");
  addLike(patrickPost, "60732f6f9344955ba436a1bc");
  listOfPosts.push(patrickPost);

  // Avani's post with recipe
  const avaniPost = makePost(
    (id = ObjectId("606f05f5cba5cb48b03f2abc")),
    (creator = "60732f6f9344955ba436a1bc"),
    (recipe = "TODO: Avani's recipe"),
    (text =
      "I ordered this drink by accident at the bar one time and have been in love with it ever since. Check it out and let me know what you all think!")
  );
  // Add some likes to Avani's post
  addLike(avaniPost, "60732518372d3ae3b871f315");
  addLike(avaniPost, "607322eb50dc91a9bc14955b");
  addLike(avaniPost, "6073261f162457f64eddacfb");
  listOfPosts.push(avaniPost);

  console.log(listOfPosts);

  await postCollection.insertMany(listOfPosts);

  // users seeding

  // tim user info
  const tim = await users.createSeedUser(
    ObjectId("607322eb50dc91a9bc14955b"), //_id
    "Timothy", //firstName
    "Wang", //lastName
    "timothyw0", // username
    "timothyw0@gmail.com", //email
    "12/12/1994", //age
    "Passwordtim1", //hashPassword
    [
      "60732518372d3ae3b871f315",
      "6073261f162457f64eddacfb",
      "60732579ee3a5bd593f2771a",
      "60732f6f9344955ba436a1bc",
    ], //following
    ["606f04246c785b72ecce993f"], // posts
    [], //recipes
    [], //comments
    "" //profilePicture
  );

  // kishan user info
  const kishan = await users.createSeedUser(
    ObjectId("60732518372d3ae3b871f315"), //_id
    "Kishan", //firstName
    "Senjaliya", //lastName
    "Kishans", // username
    "kishans@gmail.com", //email
    "12/12/1994", //age
    "Passwordkishan1", //hashPassword
    [
      "607322eb50dc91a9bc14955b",
      "60732579ee3a5bd593f2771a",
      "6073261f162457f64eddacfb",
      "60732f6f9344955ba436a1bc",
    ], //following
    ["606f04cf30078a027490273e"], // posts
    [], //recipes
    [], //comments
    "" //profilePicture
  );

  // billy user info
  const billy = await users.createSeedUser(
    ObjectId("60732579ee3a5bd593f2771a"), //_id
    "William", //firstName
    "Kingsberry", //lastName
    "wking", // username
    "wkingsbe@stevens.edu", //email
    "12/12/1994", //age
    "Passwordbilly1", //hashPassword
    [
      "607322eb50dc91a9bc14955b",
      "60732518372d3ae3b871f315",
      "6073261f162457f64eddacfb",
      "60732f6f9344955ba436a1bc",
    ], //following
    ["606f054262b48cb2e8dc5af7"], // posts
    [], //recipes
    [], //comments
    "" //profilePicture
  );

  // avani user info
  const avani = await users.createSeedUser(
    ObjectId("60732f6f9344955ba436a1bc"), //_id
    "Avani", //firstName
    "Chheta", //lastName
    "achheta", // username
    "achheta@gmail.com", //email
    "12/12/1994", //age
    "Passwordava1", //hashPassword
    [
      "607322eb50dc91a9bc14955b",
      "60732518372d3ae3b871f315",
      "60732579ee3a5bd593f2771a",
    ], //following
    ["606f05f5cba5cb48b03f2abc"], // posts
    [], //recipes
    [], //comments
    "" //profilePicture
  );

  // pat user info
  const pat = await users.createSeedUser(
    ObjectId("6073261f162457f64eddacfb"), //_id
    "Patrick", //firstName
    "Pondo", //lastName
    "ppondo", // username
    "ppondo@stevens.edu", //email
    "12/12/1994", //age
    "Passwordpat1", //hashPassword
    [
      "607322eb50dc91a9bc14955b",
      "60732518372d3ae3b871f315",
      "60732579ee3a5bd593f2771a",
      "60732f6f9344955ba436a1bc",
    ], //following
    ["606f05bb4e7e233e61f8beb7"], // posts
    [], //recipes
    [], //comments
    "" //profilePicture
  );

  const timComment = await makeComments(
    ObjectId("609b31570389485c03d4ab8a"),
    "607322eb50dc91a9bc14955b",
    "606f04246c785b72ecce993f",
    "nice"
  ); //tim comment
  listOfComments.push(timComment);
  const addedTim = await users.addCommentToUser('607322eb50dc91a9bc14955b', timComment._id.toString());

  const kishanComment = await makeComments(
    ObjectId("609b31570389485c03d4ab8b"),
    "60732518372d3ae3b871f315",
    "606f04cf30078a027490273e",
    "very cool!"
  ); //kishan comment
  listOfComments.push(kishanComment);
  const addedKishan = await users.addCommentToUser('60732518372d3ae3b871f315', kishanComment._id.toString());

  const patComment = await makeComments(
    ObjectId("609b31570389485c03d4ab8c"),
    "6073261f162457f64eddacfb",
    "606f05bb4e7e233e61f8beb7",
    "wooahh"
  ); //patrick comment
  listOfComments.push(patComment);
  const addedPat = await users.addCommentToUser('6073261f162457f64eddacfb', patComment._id.toString());

  const avaniComment = await makeComments(
    ObjectId("609b31570389485c03d4ab8d"),
    "60732f6f9344955ba436a1bc",
    "606f05f5cba5cb48b03f2abc",
    "looks super good."
  ); //avani comment
  listOfComments.push(avaniComment);
  const addedAvani = await users.addCommentToUser('60732f6f9344955ba436a1bc', avaniComment._id.toString());

  const billyComment = await makeComments(
    ObjectId("609b31570389485c03d4ab8e"),
    "60732579ee3a5bd593f2771a",
    "606f054262b48cb2e8dc5af7",
    "sounds delicious!"
  ); //billy comment
  listOfComments.push(billyComment);
  const addedBilly = await users.addCommentToUser('60732579ee3a5bd593f2771a', billyComment._id.toString());

  await commentsCollection.insertMany(listOfComments);
  console.log(listOfComments);

  console.log(tim);
  console.log(kishan);
  console.log(billy);
  console.log(avani);
  console.log(pat);

  console.log("Done seeding collections in database");
  await db.serverConfig.close();
};

main().catch(console.log);
