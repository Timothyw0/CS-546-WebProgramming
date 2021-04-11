const connection = require("../config/mongoConnection");
let { ObjectId } = require("mongodb");

const main = async () => {
    const db = await connection();
    try {
        await db.collection("comments").dropCollection();
    } catch (e) { }
    // Start seeding
    const commentsCollection = await db.collection("comments");
    /* 
      Comments Collection:
      _id (ObjectID)
      userId (ObjectID)
      postId (ObjectID)
      comments (text)
    */

    const makeComments = function (id, userId, postId, comment) {
        // userId and postId must be an ObjectID
        return {
            _id: id,
            userId: userId,
            postId: postId,
            comment: comment
        };
    };

    const listOfComments = [];

    // Avani's Comments
    const avaniComments = makeComments(
        (id = ObjectId("607337e263b9943b8a37c81a")),
        (userId = "60732f6f9344955ba436a1bc"),
        (postId = "606f05f5cba5cb48b03f2abc"),
        (comment = "This is a super cool vodka!")
    );
    listOfComments.push(avaniComments);

    // Patrick's Comments

    const PatrickComments = makeComments(
        (id = ObjectId("60733847d2186378688423fe")),
        (userId = "6073261f162457f64eddacfb"),
        (postId = "606f05bb4e7e233e61f8beb7"),
        (comment = "A proper gentlemens drinks!")
    )
    listOfComments.push(PatrickComments);

    //Kishan's Comments
    const kishanComments = makeComments(
        (id = ObjectId("6073381063d7181c540f28e0")),
        (userId = "60732518372d3ae3b871f315"),
        (postId = "606f04cf30078a027490273e"),
        (comment = "This drink is very good!")
    )
    listOfComments.push(kishanComments);

    //Tim's Comments
    const TimComments = makeComments(
        (id = ObjectId("60733824fe2a30f88c67da7e")),
        (userId = "607322eb50dc91a9bc14955b"),
        (postId = "606f04246c785b72ecce993f"),
        (comment = "This beer is bitter!")
    )
    listOfComments.push(TimComments);

    // Billy's Comments

    const BillyComments = makeComments(
        (id = ObjectId("607338388c1c24ffef2c1a5a")),
        (userId = "60732579ee3a5bd593f2771a"),
        (postId = "606f054262b48cb2e8dc5af7"),
        (comment = "This wine is smooth!")
    )
    listOfComments.push(BillyComments);

    console.log(listOfComments);

    await commentsCollection.insertMany(listOfComments);

    console.log("Done seeding comments collection in database");
    await db.serverConfig.close();
};

main().catch(console.log);