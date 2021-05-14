const connection = require("../config/mongoConnection");
let { ObjectId } = require("mongodb");
const users = require("../data/userData");
const comment = require("../data/comment");
const recipes = require("../data/recipes");

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

  const listOfComments = [];

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

  const timComment = await comment.createComment(
    "607322eb50dc91a9bc14955b",
    "606f054262b48cb2e8dc5af7",
    "nice"
  ); //tim comment
  const addedTim = await users.addCommentToUser(
    "607322eb50dc91a9bc14955b",
    timComment._id.toString()
  );
  const timRecipe = await recipes.addRecipe(
    "607322eb50dc91a9bc14955b",
    "Whiskey Sour",
    "whiskey",
    "whiskey, bitters, egg white, lemon",
    "Add 1 shot of whiskey with half a lemon and egg white, then shake for 30 sec. Serve over ice with a dash of a few bitters.",
    "3",
    "https://www.youtube.com/embed/WLUqBrih0fU"
  );
  const addRecipetoTim = await users.addRecipeToUser(
    "607322eb50dc91a9bc14955b",
    timRecipe._id.toString()
  );
  // kishan user info
  const kishan = await users.createSeedUser(
    ObjectId("60732518372d3ae3b871f315"), //_id
    "Kishan", //firstName
    "Senjaliya", //lastName
    "kishans", // username
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

  const kishanComment = await comment.createComment(
    "60732518372d3ae3b871f315",
    "606f054262b48cb2e8dc5af7",
    "very cool!"
  ); //tim comment
  const addedKishan = await users.addCommentToUser(
    "60732518372d3ae3b871f315",
    kishanComment._id.toString()
  );
  const kishanRecipe = await recipes.addRecipe(
    "60732518372d3ae3b871f315",
    "Kishan recipe",
    "beer",
    "soda",
    "steps for recipes",
    "2",
    ""
  );
  const addRecipetoKishan = await users.addRecipeToUser(
    "60732518372d3ae3b871f315",
    kishanRecipe._id.toString()
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

  const billyComment = await comment.createComment(
    "60732579ee3a5bd593f2771a",
    "606f04cf30078a027490273e",
    "sounds delicious!"
  ); //tim comment
  const addedBilly = await users.addCommentToUser(
    "60732579ee3a5bd593f2771a",
    billyComment._id.toString()
  );
  const billyRecipe = await recipes.addRecipe(
    "60732579ee3a5bd593f2771a",
    "Billy recipe",
    "vodka",
    "olives",
    "steps for recipes",
    "6",
    ""
  );
  const addRecipetoBilly = await users.addRecipeToUser(
    "60732579ee3a5bd593f2771a",
    billyRecipe._id.toString()
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

  const avaniComment = await comment.createComment(
    "60732f6f9344955ba436a1bc",
    "606f05bb4e7e233e61f8beb7",
    "looks super good."
  ); //avani comment
  const addedAvani = await users.addCommentToUser(
    "60732f6f9344955ba436a1bc",
    avaniComment._id.toString()
  );
  const avaniRecipe = await recipes.addRecipe(
    "60732f6f9344955ba436a1bc",
    "Avani recipe",
    "rum",
    "orange",
    "steps for recipes",
    "4",
    ""
  );
  const addRecipetoAvani = await users.addRecipeToUser(
    "60732f6f9344955ba436a1bc",
    avaniRecipe._id.toString()
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

  const patComment = await comment.createComment(
    "6073261f162457f64eddacfb",
    "606f05f5cba5cb48b03f2abc",
    "wooahh"
  ); //avani comment
  const addedPat = await users.addCommentToUser(
    "6073261f162457f64eddacfb",
    patComment._id.toString()
  );
  const patRecipe = await recipes.addRecipe(
    "6073261f162457f64eddacfb",
    "Pat recipe",
    "gin",
    "pineapple,soda",
    "steps for recipes",
    "6",
    ""
  );
  const addRecipetoPat = await users.addRecipeToUser(
    "6073261f162457f64eddacfb",
    patRecipe._id.toString()
  );
  
  console.log(tim);
  console.log(kishan);
  console.log(billy);
  console.log(avani);
  console.log(pat);

  const listOfPosts = [];
  // Tim's post with recipe
  const timPost = makePost(
    (id = ObjectId("606f04246c785b72ecce993f")),
    (creator = "607322eb50dc91a9bc14955b"),
    (recipe = timRecipe._id.toString()),
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
    (recipe = billyRecipe._id.toString()),
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
    (recipe = avaniRecipe._id.toString()),
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

  console.log("Done seeding collections in database");
  await db.serverConfig.close();
};

main().catch(console.log);
