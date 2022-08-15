require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/recipe");

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;

    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Cooking Blog - Categoreis",
      categories,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Cooking Blog - Search", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explplore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) {
          console.log("errorcha");
          return res.status(500).send(err);
        }
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: "/uploads/" + newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    res.json(error);
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();

// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();

/**
 * Dummy Data Example
 */

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       },
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       },
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();

// async function insertDymmyRecipeData() {
//   try {
//     await Recipe.insertMany([
//       {
//         name: "Garides Saganaki",
//         description:
//           "Place the prawns in a pot and add enough water to cover. Boil for 5 minutes. Drain, reserving the liquid, and set aside.\r\n" +
//           "Heat 2 tablespoons of oil in a saucepan. Add the onion; cook and stir until soft. Mix in the parsley, wine, tomatoes, garlic and remaining olive oil. Simmer, stirring occasionally, for about 30 minutes, or until the sauce is thickened.\r\n" +
//           "While the sauce is simmering, the prawns should become cool enough to handle. First remove the legs by pinching them, and then pull off the shells, leaving the head and tail on.\r\n" +
//           "When the sauce has thickened, stir in the prawns. Bring to a simmer again if the sauce has cooled with the prawns, and cook for about 5 minutes. Add the feta and remove from the heat. Let stand until the cheese starts to melt. Serve warm with slices of crusty bread.\r\n" +
//           "Though completely untraditional, you can add a few tablespoons of stock or passata to this recipe to make a delicious pasta sauce. Toss with pasta after adding the feta, and serve.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/wuvryu1468232995.jpg",
//       },
//       {
//         name: "French Lentils With Garlic and Thyme",
//         description:
//           "Place a large saucepan over medium heat and add oil. When hot, add chopped vegetables and sauté until softened, 5 to 10 minutes.\r\n" +
//           "Add 6 cups water, lentils, thyme, bay leaves and salt. Bring to a boil, then reduce to a fast simmer.\r\n" +
//           "Simmer lentils until they are tender and have absorbed most of the water, 20 to 25 minutes. If necessary, drain any excess water after lentils have cooked. Serve immediately, or allow them to cool and reheat later.\r\n" +
//           "For a fuller taste, use some chicken stock and reduce the water by the same amount.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/vwwspt1487394060.jpg",
//       },

//       {
//         name: "Vegan Chocolate Cake",
//         description:
//           "Simply mix all dry ingredients with wet ingredients and blend altogether. Bake for 45 min on 180 degrees. Decorate with some melted vegan chocolate ",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 tsp baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/qxutws1486978099.jpg",
//       },

//       {
//         name: "Irish stew",
//         description:
//           "Heat the oven to 180C/350F/gas mark 4. Drain and rinse the soaked wheat, put it in a medium pan with lots of water, bring to a boil and simmer for an hour, until cooked. Drain and set aside.\r\n" +
//           "\r\n" +
//           "Season the lamb with a teaspoon of salt and some black pepper. Put one tablespoon of oil in a large, deep sauté pan for which you have a lid; place on a medium-high heat. Add some of the lamb – don't overcrowd the pan – and sear for four minutes on all sides. Transfer to a bowl, and repeat with the remaining lamb, adding oil as needed.\r\n" +
//           "\r\n" +
//           "Lower the heat to medium and add a tablespoon of oil to the pan. Add the shallots and fry for four minutes, until caramelised. Tip these into the lamb bowl, and repeat with the remaining vegetables until they are all nice and brown, adding more oil as you need it.\r\n" +
//           "\r\n" +
//           "Once all the vegetables are seared and removed from the pan, add the wine along with the sugar, herbs, a teaspoon of salt and a good grind of black pepper. Boil on a high heat for about three minutes.\r\n" +
//           "\r\n" +
//           "Tip the lamb, vegetables and whole wheat back into the pot, and add the stock. Cover and boil for five minutes, then transfer to the oven for an hour and a half.\r\n" +
//           "\r\n" +
//           "Remove the stew from the oven and check the liquid; if there is a lot, remove the lid and boil for a few minutes",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/sxxpst1468569714.jpg",
//       },

//       {
//         name: "Apam balik",
//         description:
//           "Mix milk, oil and egg together. Sift flour, baking powder and salt into the mixture. Stir well until all ingredients are combined evenly.\r\n" +
//           "\r\n" +
//           "Spread some batter onto the pan. Spread a thin layer of batter to the side of the pan. Cover the pan for 30-60 seconds until small air bubbles appear.\r\n" +
//           "\r\n" +
//           "Add butter, cream corn, crushed peanuts and sugar onto the pancake. Fold the pancake into half once the bottom surface is browned.\r\n" +
//           "\r\n" +
//           "Cut into wedges and best eaten when it is warm.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/adxcbq1619787919.jpg",
//       },

//       {
//         name: "Lasagne",
//         description:
//           "Heat the oil in a large saucepan. Use kitchen scissors to snip the bacon into small pieces, or use a sharp knife to chop it on a chopping board. Add the bacon to the pan and cook for just a few mins until starting to turn golden. Add the onion, celery and carrot, and cook over a medium heat for 5 mins, stirring occasionally, until softened.\r\n" +
//           "Add the garlic and cook for 1 min, then tip in the mince and cook, stirring and breaking it up with a wooden spoon, for about 6 mins until browned all over.\r\n" +
//           "Stir in the tomato purée and cook for 1 min, mixing in well with the beef and vegetables. Tip in the chopped tomatoes. Fill each can half full with water to rinse out any tomatoes left in the can, and add to the pan. Add the honey and season to taste. Simmer for 20 mins.\r\n" +
//           "Heat oven to 200C/180C fan/gas 6. To assemble the lasagne, ladle a little of the ragu sauce into the bottom of the roasting tin or casserole dish, spreading the sauce all over the base. Place 2 sheets of lasagne on top of the sauce overlapping to make it fit, then repeat with more sauce and another layer of pasta. Repeat with a further 2 layers of sauce and pasta, finishing with a layer of pasta.\r\n" +
//           "Put the crème fraîche in a bowl and mix with 2 tbsp water to loosen it and make a smooth pourable sauce. Pour this over the top of the pasta, then top with the mozzarella. Sprinkle Parmesan over the top and bake for 25–30 mins until golden and bubbling. Serve scattered with basil, if you like.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg",
//       },

//       {
//         name: "Sugar Pie",
//         description:
//           "Preheat oven to 350 degrees F (175 degrees C). Grease a 9-inch pie dish.\r\n" +
//           "Place the brown sugar and butter in a mixing bowl, and beat them together with an electric mixer until creamy and very well combined, without lumps. Beat in eggs, one at a time, incorporating the first egg before adding the next one. Add the vanilla extract and salt; beat the flour in, a little at a time, and then the milk, making a creamy batter. Pour the batter into the prepared pie dish.\r\n" +
//           "Bake in the preheated oven for 35 minutes; remove pie, and cover the rim with aluminum foil to prevent burning. Return to oven, and bake until the middle sets and the top forms a crusty layer, about 15 more minutes. Let the pie cool to room temperature, then refrigerate for at least 1 hour before serving.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/yrstur1511816601.jpg",
//       },

//       {
//         name: "Spaghetti alla Carbonara",
//         description:
//           "STEP 1\r\n" +
//           "Put a large saucepan of water on to boil.\r\n" +
//           "\r\n" +
//           "STEP 2\r\n" +
//           "Finely chop the 100g pancetta, having first removed any rind. Finely grate 50g pecorino cheese and 50g parmesan and mix them together.\r\n" +
//           "\r\n" +
//           "STEP 3\r\n" +
//           "Beat the 3 large eggs in a medium bowl and season with a little freshly grated black pepper. Set everything aside.\r\n" +
//           "\r\n" +
//           "STEP 4\r\n" +
//           "Add 1 tsp salt to the boiling water, add 350g spaghetti and when the water comes back to the boil, cook at a constant simmer, covered, for 10 minutes or until al dente (just cooked).\r\n" +
//           "\r\n" +
//           "STEP 5\r\n" +
//           "Squash 2 peeled plump garlic cloves with the blade of a knife, just to bruise it.\r\n" +
//           "\r\n" +
//           "STEP 6\r\n" +
//           "While the spaghetti is cooking, fry the pancetta with the garlic. Drop 50g unsalted butter into a large frying pan or wok and, as soon as the butter has melted, tip in the pancetta and garlic.\r\n" +
//           "\r\n" +
//           "STEP 7\r\n" +
//           "Leave to cook on a medium heat for about 5 minutes, stirring often, until the pancetta is golden and crisp. The garlic has now imparted its flavour, so take it out with a slotted spoon and discard.\r\n" +
//           "\r\n" +
//           "STEP 8\r\n" +
//           "Keep the heat under the pancetta on low. When the pasta is ready, lift it from the water with a pasta fork or tongs and put it in the frying pan with the pancetta. Don’t worry if a little water drops in the pan as well (you want this to happen) and don’t throw the pasta water away yet.\r\n" +
//           "\r\n" +
//           "STEP 9\r\n" +
//           "Mix most of the cheese in with the eggs, keeping a small handful back for sprinkling over later.\r\n" +
//           "\r\n" +
//           "STEP 10\r\n" +
//           "Take the pan of spaghetti and pancetta off the heat. Now quickly pour in the eggs and cheese. Using the tongs or a long fork, lift up the spaghetti so it mixes easily with the egg mixture, which thickens but doesn’t scramble, and everything is coated.\r\n" +
//           "\r\n" +
//           "STEP 11\r\n" +
//           "Add extra pasta cooking water to keep it saucy (several tablespoons should do it). You don’t want it wet, just moist. Season with a little salt, if needed.\r\n" +
//           "\r\n" +
//           "STEP 12\r\n" +
//           "Use a long-pronged fork to twist the pasta on to the serving plate or bowl. Serve immediately with a little sprinkling of the remaining cheese and a grating of black pepper. If the dish does get a little dry before serving, splash in some more hot pasta water and the glossy sauciness will be revived.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
//       },

//       {
//         name: "Bitterballen (Dutch meatballs)",
//         description:
//           "Melt the butter in a skillet or pan. When melted, add the flour little by little and stir into a thick paste. Slowly stir in the stock, making sure the roux absorbs the liquid. Simmer for a couple of minutes on a low heat while you stir in the onion, parsley and the shredded meat. The mixture should thicken and turn into a heavy, thick sauce.\r\n" +
//           "\r\n" +
//           "Pour the mixture into a shallow container, cover and refrigerate for several hours, or until the sauce has solidified.\r\n" +
//           "\r\n" +
//           "Take a heaping tablespoon of the cold, thick sauce and quickly roll it into a small ball. Roll lightly through the flour, then the egg and finally the breadcrumbs. Make sure that the egg covers the whole surface of the bitterbal. When done, refrigerate the snacks while the oil in your fryer heats up to 190C (375F). Fry four bitterballen at a time, until golden.\r\n" +
//           "\r\n" +
//           "Serve on a plate with a nice grainy or spicy mustard.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/lhqev81565090111.jpg",
//       },

//       {
//         name: "Dal fry",
//         description:
//           "Wash and soak toor dal in approx. 3 cups of water, for at least one hours. Dal will be double in volume after soaking. Drain the water.\r\n" +
//           "Cook dal with 2-1/2 cups water and add salt, turmeric, on medium high heat, until soft in texture (approximately 30 mins) it should be like thick soup.\r\n" +
//           "In a frying pan, heat the ghee. Add cumin seeds, and mustard seeds. After the seeds crack, add bay leaves, green chili, ginger and chili powder. Stir for a few seconds.\r\n" +
//           "Add tomatoes, salt and sugar stir and cook until tomatoes are tender and mushy.\r\n" +
//           "Add cilantro and garam masala cook for about one minute.\r\n" +
//           "Pour the seasoning over dal mix it well and cook for another minute.\r\n" +
//           "Serve with Naan.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg",
//       },

//       {
//         name: "Portuguese barbecued pork (Febras assadas)",
//         description:
//           "STEP 1\r\n" +
//           "\r\n" +
//           "Cut the tenderloins into 5 equal-size pieces leaving the tail ends a little longer. Take a clear plastic bag and slip one of the pieces in. Bash it into an escalope the size of a side-plate with a rolling pin and repeat with the remaining pieces.\r\n" +
//           "\r\n" +
//           "STEP 2\r\n" +
//           "\r\n" +
//           "Put the wine, paprika, some salt and pepper and the juice of ½ a lemon in a bowl and add the pork. Leave to marinate for 20-30 minutes, while you get your barbecue to the stage where the coals are glowing but there are no flames.\r\n" +
//           "\r\n" +
//           "STEP 3\r\n" +
//           "\r\n" +
//           "To make the chips, fill a basin with cool water and cut the potatoes into 3cm-thick chips. Soak them in the water for 5 minutes and then change the water. Leave for 5 more minutes. Drain and then pat dry on a towel or with kitchen paper.\r\n" +
//           "\r\n" +
//           "STEP 4\r\n" +
//           "\r\n" +
//           "Heat the oil in a deep fryer or a deep heavy-based pan with a lid to 130C and lower the chips into the oil (in batches). Blanch for 8-10 minutes. Remove from the oil and drain well. Place on a tray to cool. Reheat the oil to 180C (make sure it’s hot or your chips will be soggy) and lower the basket of chips into the oil (again, do this in batches). Leave to cook for 2 minutes and then give them a little shake. Cook for another minute or so until they are well coloured and crisp to the touch. Drain well for a few minutes, tip into a bowl and sprinkle with sea salt.\r\n" +
//           "\r\n" +
//           "STEP 5\r\n" +
//           "\r\n" +
//           "The pork will cook quickly so do it in 2 batches. Take the pieces out of the marinade, rub them with oil, and drop them onto the barbecue (you could also use a chargrill). Cook for 1 minute on each side – they may flare up as you do so. This should really be enough time as they will keep on cooking. Take them off the barbecue and pile onto a plate. Repeat with the remaining batch.\r\n" +
//           "\r\n" +
//           "STEP 6\r\n" +
//           "\r\n" +
//           "Serve by piling a plate with chips, drop the pork on top of each pile and pouring the juices from the plate over so the chips take up the flavours. Top with a spoon of mayonnaise and a wedge of lemon.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/cybyue1614349443.jpg",
//       },

//       {
//         name: "Paszteciki (Polish Pasties)",
//         description:
//           "Sift flour and salt into a large mixing bowl.\r\n" +
//           "Use a spoon to push the egg yolk through a fine sieve into the flour.\r\n" +
//           "Add the raw egg and mix well.\r\n" +
//           "Beat in butter 1 tablespoon at a time.\r\n" +
//           "Place dough on a floured surface and knead until smooth and elastic, then wrap in waxed paper and refrigerate until firm (at least 30 minutes).\r\n" +
//           "In a heavy skillet, melt 2 tablespoons butter over medium heat; saute the onion and rutabaga until the onion is soft and transparent (5 minutes).\r\n" +
//           "Put the onions, rutabaga, and beef through a meat grinder twice if you have one, if not just chop them up as fine as possible.\r\n" +
//           "Melt the remaining 4 tablespoons butter over medium heat, and add the meat mixture.\r\n" +
//           "Cook over low heat, stirring occasionally, until all of the liquid has evaporated and the mixture is thick enough to hold its shape.\r\n" +
//           "Remove from heat and let cool, then stir in 1 egg, and season with salt and pepper.\r\n" +
//           "Preheat oven to 350°F.\r\n" +
//           'On a lightly floured surface, roll the dough out into a 13x8" rectangle (1/8" thick).\r\n' +
//           "Spoon the filling down the center of the rectangle lengthwise, leaving about an inch of space on each end.\r\n" +
//           "Lightly brush the long sides with cold water, then fold one of the long sides over the filling and the other side over the top of that.\r\n" +
//           "Brush the short ends with cold water and fold them over the top, enclosing the filling.\r\n" +
//           "Place pastry seam side down on a baking sheet and brush the top evenly with the remaining scrambled egg.\r\n" +
//           "Bake in preheated oven until rich golden brown (30 minutes).\r\n" +
//           'Slice pastry diagonally into 1.5" long pieces and serve as an appetizer or with soup.',
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1/4 tsp Pepper",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/c9a3l31593261890.jpg",
//       },

//       {
//         name: "Grilled Mac and Cheese Sandwich",
//         description:
//           "Make the mac and cheese\r\n" +
//           "\r\n" +
//           "1. Bring a medium saucepan of generously salted water (you want it to taste like seawater) to a boil. Add the pasta and cook, stirring occasionally, until al dente, 8 to 10 minutes, or according to the package directions. The pasta should be tender but still chewy.\r\n" +
//           "2. While the pasta is cooking, in a small bowl, whisk together the flour, mustard powder, garlic powder, salt, black pepper, and cayenne pepper.\r\n" +
//           "3. Drain the pasta in a colander. Place the empty pasta pan (no need to wash it) over low heat and add the butter. When the butter has melted, whisk in the flour mixture and continue to cook, whisking frequently, until the mixture is beginning to brown and has a pleasant, nutty aroma, about 1 minute. Watch carefully so it does not scorch on the bottom of the pan.\r\n" +
//           "4. Slowly whisk the milk and cream into the flour mixture until everything is really well combined. Cook, whisking constantly, until the sauce is heated through and just begins to thicken, about 2 minutes. Remove from the heat. Gradually add the cheese while stirring constantly with a wooden spoon or silicone spatula and keep stirring until the cheese has melted into the sauce. Then stir in the drained cooked pasta.\r\n" +
//           "5. Line a 9-by-13-inch (23-by-33-centimeter) rimmed baking sheet with parchment paper or aluminum foil. Coat the paper or foil with nonstick cooking spray or slick it with butter. Pour the warm mac and cheese onto the prepared baking sheet and spread it evenly with a spatula. Coat another piece of parchment paper with cooking spray or butter and place it, oiled or buttered side down, directly on the surface of the mac and cheese. Refrigerate until cool and firm, about 1 hour.\r\n" +
//           "\r\n" +
//           "Make the grilled cheese\r\n" +
//           "6. Heat a large cast-iron or nonstick skillet over medium-low heat.\r\n" +
//           "7. In a small bowl, stir together the 4 tablespoons (55 grams) butter and garlic powder until well blended.\r\n" +
//           "8. Remove the mac and cheese from the refrigerator and peel off the top layer of parchment paper. Carefully cut into 8 equal pieces. Each piece will make 1 grilled mac and cheese sandwich. (You can stash each individual portion in a double layer of resealable plastic bags and refrigerate for up to 3 days or freeze it for up to 1 month.)\r\n" +
//           "9. Spread 3/4 teaspoon garlic butter on one side of each bread slice. Place half of the slices, buttered-side down, on a clean cutting board. Top each with one slice of Cheddar, then 1 piece of the mac and cheese. (Transfer from the baking sheet by scooting your hand or a spatula under each piece of mac and cheese and then flipping it over onto a sandwich.) Place 1 slice of Jack on top of each. Finish with the remaining bread slices, buttered-side up.\r\n" +
//           "10. Using a wide spatula, place as many sandwiches in the pan as will fit without crowding it. Cover and cook until the bottoms are nicely browned, about 4 minutes. Turn and cook until the second sides are browned, the cheese is melted, and the mac and cheese is heated through, about 4 minutes more.\r\n" +
//           "11. Repeat with the remaining ingredients. Cut the sandwiches in half, if desired, and serve.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//           "3/4 teaspoon Mustard Powder",
//           "1/8 teaspoon Cayenne pepper",
//           "1 pound (455 grams) Monterey Jack Cheese",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/xutquv1505330523.jpg",
//       },

//       {
//         name: "Pilchard puttanesca",
//         description:
//           "Cook the pasta following pack instructions. Heat the oil in a non-stick frying pan and cook the onion, garlic and chilli for 3-4 mins to soften. Stir in the tomato purée and cook for 1 min, then add the pilchards with their sauce. Cook, breaking up the fish with a wooden spoon, then add the olives and continue to cook for a few more mins.\r\n" +
//           "\r\n" +
//           "Drain the pasta and add to the pan with 2-3 tbsp of the cooking water. Toss everything together well, then divide between plates and serve, scattered with Parmesan.",
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "Spaghetti",
//           "Olive Oil",
//           "Garlic",
//           "Red Chilli",
//           "1 finely chopped ",
//           "2 cloves minced",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image:
//           "https://www.themealdb.com/images/media/meals/vvtvtr1511180578.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         description: `Recipe Description Goes Here`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "American",
//         image:
//           "https://www.themealdb.com/images/media/meals/wuvryu1468232995.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         description: `Recipe Description Goes Here`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "American",
//         image:
//           "https://www.themealdb.com/images/media/meals/qxutws1486978099.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// }

// insertDymmyRecipeData();
