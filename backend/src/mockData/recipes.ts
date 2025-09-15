import { Recipe } from "../models/recipe";

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: "Grilled Salmon with Lemon",
    description: "A delicious and healthy grilled salmon dish with fresh lemon and herbs",
    image: "/recipes/salmon.jpg",
    author: {
      name: "Chef Maria Rodriguez",
      id: '101',
      avatar: "/avatars/chef-maria.jpg"
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    cookingTime: 25,
    servings: 4,
    difficulty: "Medium",
    category: ["Seafood"],
    ingredients: [
      {
        name: "Salmon fillets",
        quantity: 4,
        unit: "pieces",
        notes: "6 oz each, skin-on"
      },
      {
        name: "Fresh lemon",
        quantity: 2,
        unit: "pieces",
        notes: "juiced and zested"
      },
      {
        name: "Olive oil",
        quantity: 3,
        unit: "tablespoons",
        notes: "extra virgin"
      },
      {
        name: "Fresh dill",
        quantity: 2,
        unit: "tablespoons",
        notes: "chopped"
      },
      {
        name: "Garlic",
        quantity: 3,
        unit: "cloves",
        notes: "minced"
      },
      {
        name: "Salt",
        quantity: 1,
        unit: "teaspoon",
        notes: "sea salt"
      },
      {
        name: "Black pepper",
        quantity: 0.5,
        unit: "teaspoon",
        notes: "freshly ground"
      },
      {
        name: "Butter",
        quantity: 2,
        unit: "tablespoons",
        notes: "unsalted"
      }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Preheat grill to medium-high heat and oil the grates to prevent sticking.",
        duration: 5
      },
      {
        stepNumber: 2,
        instruction: "Pat salmon fillets dry with paper towels and season both sides with salt and pepper.",
        duration: 3
      },
      {
        stepNumber: 3,
        instruction: "In a small bowl, mix olive oil, minced garlic, lemon zest, and chopped dill.",
        duration: 2
      },
      {
        stepNumber: 4,
        instruction: "Brush the herb mixture over both sides of the salmon fillets.",
        duration: 2
      },
      {
        stepNumber: 5,
        instruction: "Grill salmon skin-side down for 4-5 minutes without moving it.",
        duration: 5
      },
      {
        stepNumber: 6,
        instruction: "Flip salmon carefully and grill for another 3-4 minutes until fish flakes easily.",
        duration: 4
      },
      {
        stepNumber: 7,
        instruction: "Remove from grill and immediately top with butter and fresh lemon juice.",
        duration: 1
      },
      {
        stepNumber: 8,
        instruction: "Let rest for 2 minutes before serving with lemon wedges.",
        duration: 2
      }
    ],
    tags: ["healthy", "quick", "grilled", "seafood", "gluten-free"],
    nutrition: {
      calories: 350,
      protein: 35,
      carbs: 2,
      fat: 22,
      fiber: 0
    },
    rating: 4.8,
    reviewCount: 127,
    savedBy: [],
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '2',
    title: "Classic Margherita Pizza",
    description: "Authentic Italian pizza with fresh mozzarella, tomatoes, and basil",
    image: "/recipes/margarita-pizza.jpg",
    author: {
      name: "Antonio Bianchi",
      id: '102',
      avatar: "/avatars/chef-antonio.jpg"
    },
    createdAt: "2024-01-20T14:45:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    cookingTime: 90,
    servings: 4,
    difficulty: "Medium",
    category: ["Italian", "Pizza"],
    ingredients: [
      {
        name: "Pizza dough",
        quantity: 1,
        unit: "ball",
        notes: "store-bought or homemade"
      },
      {
        name: "San Marzano tomatoes",
        quantity: 400,
        unit: "grams",
        notes: "crushed"
      },
      {
        name: "Fresh mozzarella",
        quantity: 250,
        unit: "grams",
        notes: "torn into pieces"
      },
      {
        name: "Fresh basil leaves",
        quantity: 15,
        unit: "leaves",
        notes: "whole"
      },
      {
        name: "Extra virgin olive oil",
        quantity: 3,
        unit: "tablespoons",
        notes: "good quality"
      },
      {
        name: "Garlic",
        quantity: 2,
        unit: "cloves",
        notes: "minced"
      },
      {
        name: "Salt",
        quantity: 1,
        unit: "teaspoon",
        notes: "sea salt"
      },
      {
        name: "Black pepper",
        quantity: 0.25,
        unit: "teaspoon",
        notes: "freshly ground"
      },
      {
        name: "Parmesan cheese",
        quantity: 50,
        unit: "grams",
        notes: "grated, optional"
      }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Preheat oven to 475°F (245°C) with pizza stone inside if available.",
        duration: 30
      },
      {
        stepNumber: 2,
        instruction: "Mix crushed tomatoes with minced garlic, 1 tbsp olive oil, salt, and pepper for sauce.",
        duration: 5
      },
      {
        stepNumber: 3,
        instruction: "Roll out pizza dough on floured surface to 12-inch diameter.",
        duration: 8
      },
      {
        stepNumber: 4,
        instruction: "Transfer dough to parchment paper or pizza peel dusted with cornmeal.",
        duration: 2
      },
      {
        stepNumber: 5,
        instruction: "Spread tomato sauce evenly, leaving 1-inch border for crust.",
        duration: 3
      },
      {
        stepNumber: 6,
        instruction: "Distribute torn mozzarella pieces evenly over sauce.",
        duration: 2
      },
      {
        stepNumber: 7,
        instruction: "Drizzle with remaining olive oil and season lightly with salt and pepper.",
        duration: 1
      },
      {
        stepNumber: 8,
        instruction: "Bake for 12-15 minutes until crust is golden and cheese is bubbly.",
        duration: 15
      },
      {
        stepNumber: 9,
        instruction: "Remove from oven and immediately top with fresh basil leaves.",
        duration: 1
      },
      {
        stepNumber: 10,
        instruction: "Let cool for 2-3 minutes, then slice and serve hot.",
        duration: 3
      }
    ],
    tags: ["italian", "pizza", "vegetarian", "comfort-food", "classic"],
    nutrition: {
      calories: 420,
      protein: 18,
      carbs: 45,
      fat: 18,
      fiber: 3
    },
    rating: 4.9,
    reviewCount: 203,
    savedBy: [],
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '3',
    title: "Caprese Salad",
    description: "Fresh and simple Italian salad with tomatoes, mozzarella, and basil",
    image: "/recipes/caprese.jpg",
    author: {
      name: "Isabella Rossi",
      id: '103',
      avatar: "/avatars/chef-isabella.jpg"
    },
    createdAt: "2024-01-25T11:20:00Z",
    updatedAt: "2024-01-25T11:20:00Z",
    cookingTime: 15,
    servings: 4,
    difficulty: "Easy",
    category: ["Salads", "Vegetarian"],
    ingredients: [
      {
        name: "Large tomatoes",
        quantity: 3,
        unit: "pieces",
        notes: "ripe, preferably heirloom"
      },
      {
        name: "Fresh mozzarella",
        quantity: 200,
        unit: "grams",
        notes: "buffalo mozzarella preferred"
      },
      {
        name: "Fresh basil leaves",
        quantity: 20,
        unit: "leaves",
        notes: "large leaves"
      },
      {
        name: "Extra virgin olive oil",
        quantity: 4,
        unit: "tablespoons",
        notes: "high quality"
      },
      {
        name: "Balsamic vinegar",
        quantity: 2,
        unit: "tablespoons",
        notes: "aged if possible"
      },
      {
        name: "Sea salt",
        quantity: 0.5,
        unit: "teaspoon",
        notes: "flaky sea salt"
      },
      {
        name: "Black pepper",
        quantity: 0.25,
        unit: "teaspoon",
        notes: "freshly cracked"
      }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Wash and dry the tomatoes thoroughly, then slice into 1/4-inch thick rounds.",
        duration: 5
      },
      {
        stepNumber: 2,
        instruction: "Slice the fresh mozzarella into rounds of similar thickness to tomatoes.",
        duration: 3
      },
      {
        stepNumber: 3,
        instruction: "Arrange tomato and mozzarella slices alternately on a serving platter.",
        duration: 3
      },
      {
        stepNumber: 4,
        instruction: "Tuck fresh basil leaves between the tomato and mozzarella slices.",
        duration: 2
      },
      {
        stepNumber: 5,
        instruction: "Drizzle the extra virgin olive oil evenly over the entire salad.",
        duration: 1
      },
      {
        stepNumber: 6,
        instruction: "Add a light drizzle of balsamic vinegar over the arrangement.",
        duration: 1
      },
      {
        stepNumber: 7,
        instruction: "Season with flaky sea salt and freshly cracked black pepper to taste.",
        duration: 1
      },
      {
        stepNumber: 8,
        instruction: "Let the salad rest for 5 minutes to allow flavors to meld before serving.",
        duration: 5
      }
    ],
    tags: ["italian", "salad", "vegetarian", "fresh", "no-cook", "summer"],
    nutrition: {
      calories: 220,
      protein: 12,
      carbs: 8,
      fat: 18,
      fiber: 2
    },
    rating: 4.7,
    reviewCount: 89,
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '4',
    title: "Spaghetti Carbonara",
    description: "Traditional Roman pasta dish with eggs, cheese, pancetta, and black pepper",
    image: "/recipes/carbonara.jpg",
    author: {
      name: "Giuseppe Romano",
      id: '104',
      avatar: "/avatars/chef-giuseppe.jpg"
    },
    createdAt: "2024-01-30T16:15:00Z",
    updatedAt: "2024-01-30T16:15:00Z",
    cookingTime: 25,
    servings: 4,
    difficulty: "Medium",
    category: ["Pasta", "Italian"],
    ingredients: [
      {
        name: "Spaghetti",
        quantity: 400,
        unit: "grams",
        notes: "good quality pasta"
      },
      {
        name: "Pancetta",
        quantity: 150,
        unit: "grams",
        notes: "diced"
      },
      {
        name: "Large eggs",
        quantity: 3,
        unit: "pieces",
        notes: "room temperature"
      },
      {
        name: "Egg yolks",
        quantity: 2,
        unit: "pieces",
        notes: "room temperature"
      },
      {
        name: "Pecorino Romano cheese",
        quantity: 100,
        unit: "grams",
        notes: "finely grated"
      },
      {
        name: "Black pepper",
        quantity: 1,
        unit: "teaspoon",
        notes: "freshly ground, coarse"
      },
      {
        name: "Salt",
        quantity: 1,
        unit: "tablespoon",
        notes: "for pasta water"
      },
      {
        name: "Extra virgin olive oil",
        quantity: 1,
        unit: "tablespoon",
        notes: "optional"
      }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Bring a large pot of salted water to boil for the pasta.",
        duration: 8
      },
      {
        stepNumber: 2,
        instruction: "In a large bowl, whisk together whole eggs, egg yolks, and half the grated cheese.",
        duration: 3
      },
      {
        stepNumber: 3,
        instruction: "Add freshly ground black pepper to the egg mixture and whisk well.",
        duration: 1
      },
      {
        stepNumber: 4,
        instruction: "Cook pancetta in a large skillet over medium heat until crispy, about 4-5 minutes.",
        duration: 5
      },
      {
        stepNumber: 5,
        instruction: "Add spaghetti to boiling water and cook according to package directions until al dente.",
        duration: 10
      },
      {
        stepNumber: 6,
        instruction: "Reserve 1 cup of pasta cooking water before draining the spaghetti.",
        duration: 1
      },
      {
        stepNumber: 7,
        instruction: "Add hot drained pasta to the skillet with pancetta and toss quickly.",
        duration: 1
      },
      { stepNumber: 8, instruction: "Remove skillet from heat and quickly add egg mixture, tossing constantly.", duration: 2 },
      { stepNumber: 9, instruction: "Add pasta water gradually while tossing to create a creamy sauce.", duration: 2 },
      { stepNumber: 10, instruction: "Serve immediately with remaining cheese and extra black pepper.", duration: 1 }
    ],
    tags: ["italian", "pasta", "traditional", "roman", "comfort-food"],
    nutrition: {
      calories: 520,
      protein: 24,
      carbs: 58,
      fat: 20,
      fiber: 3
    },
    rating: 4.9,
    reviewCount: 156,
    savedBy: [],
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '5',
    title: 'Chicken Alfredo',
    image: '/recipes/alfredo.jpg',
    description: 'Creamy Alfredo sauce combined with tender chicken pieces and fettuccine pasta.',
    author: {
      id: '102',
      name: 'Julia Grant',
      avatar: '/avatars/chef-julia.jpg'
    },
    createdAt: '2024-01-03T12:30:00Z',
    updatedAt: '2024-01-03T12:30:00Z',
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    category: ['Pasta', 'Italian'],
    ingredients: [
      { name: 'Fettuccine', quantity: 250, unit: 'grams' },
      { name: 'Chicken Breast', quantity: 2, unit: 'pieces', notes: 'sliced thin' },
      { name: 'Heavy Cream', quantity: 1, unit: 'cup' },
      { name: 'Parmesan Cheese', quantity: 100, unit: 'grams', notes: 'grated' },
      { name: 'Garlic', quantity: 2, unit: 'cloves', notes: 'minced' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Cook fettuccine according to package.', duration: 10 },
      { stepNumber: 2, instruction: 'Sauté garlic and chicken until cooked.', duration: 10 },
      { stepNumber: 3, instruction: 'Add cream and cheese to form sauce.', duration: 5 },
      { stepNumber: 4, instruction: 'Combine pasta and sauce, mix well.', duration: 5 }
    ],
    tags: ['creamy', 'pasta', 'comfort food'],
    nutrition: {
      calories: 600,
      protein: 35,
      carbs: 45,
      fat: 32,
      fiber: 3
    },
    rating: 4.7,
    reviewCount: 98,
    savedBy: [],
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '6',
    title: 'Vegan Buddha Bowl',
    image: '/recipes/buddha.jpg',
    description: 'Nutritious bowl with quinoa, veggies, and tahini.',
    author: { id: '104', name: 'Alex Green', avatar: '/avatars/chef-alex.jpg' },
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
    cookingTime: 50,
    servings: 2,
    difficulty: 'Easy',
    category: ['Vegan'],
    ingredients: [
      { name: 'Ingredient A', quantity: 1, unit: 'cup' },
      { name: 'Ingredient B', quantity: 2, unit: 'pieces' },
      { name: 'Ingredient C', quantity: 0.5, unit: 'teaspoon' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Prep all ingredients.', duration: 5 },
      { stepNumber: 2, instruction: 'Cook until golden brown.', duration: 15 },
      { stepNumber: 3, instruction: 'Serve and enjoy.', duration: 5 }
    ],
    tags: ['vegan', 'bowl', 'healthy'],
    nutrition: { calories: 312, protein: 15, carbs: 20, fat: 25, fiber: 4 },
    rating: 4.8,
    reviewCount: 169,
    savedBy: [],
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '7',
    title: 'Grilled Teriyaki Salmon',
    image: '/recipes/teriyaki-salmon.jpg',
    description: 'Salmon with teriyaki glaze served over rice.',
    author: { id: '101', name: "Chef Maria Rodriguez", avatar: '/avatars/chef-maria.jpg' },
    createdAt: '2024-02-06T00:00:00Z',
    updatedAt: '2024-02-06T00:00:00Z',
    cookingTime: 22,
    servings: 2,
    difficulty: 'Medium',
    category: ['Seafood'],
    ingredients: [
      { name: 'Ingredient A', quantity: 1, unit: 'cup' },
      { name: 'Ingredient B', quantity: 2, unit: 'pieces' },
      { name: 'Ingredient C', quantity: 0.5, unit: 'teaspoon' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Prep all ingredients.', duration: 5 },
      { stepNumber: 2, instruction: 'Cook until golden brown.', duration: 15 },
      { stepNumber: 3, instruction: 'Serve and enjoy.', duration: 5 }
    ],
    tags: ['seafood', 'japanese', 'grilled'],
    nutrition: { calories: 363, protein: 27, carbs: 22, fat: 15, fiber: 1 },
    rating: 4.7,
    reviewCount: 119,
    savedBy: [],
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '8',
    title: 'Mushroom Risotto',
    image: '/recipes/risotto.jpg',
    description: 'Creamy risotto with mushrooms and herbs.',
    author: { id: '106', name: 'Jean-Claude', avatar: '/avatars/chef-jean.jpg' },
    createdAt: '2024-02-07T00:00:00Z',
    updatedAt: '2024-02-07T00:00:00Z',
    cookingTime: 37,
    servings: 6,
    difficulty: 'Hard',
    category: ['Italian'],
    ingredients: [
      { name: 'Ingredient A', quantity: 1, unit: 'cup' },
      { name: 'Ingredient B', quantity: 2, unit: 'pieces' },
      { name: 'Ingredient C', quantity: 0.5, unit: 'teaspoon' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Prep all ingredients.', duration: 5 },
      { stepNumber: 2, instruction: 'Cook until golden brown.', duration: 15 },
      { stepNumber: 3, instruction: 'Serve and enjoy.', duration: 5 }
    ],
    tags: ['italian', 'comfort', 'vegetarian'],
    nutrition: { calories: 266, protein: 13, carbs: 24, fat: 10, fiber: 2 },
    rating: 4.6,
    reviewCount: 78,   
    savedBy: [], 
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '9',
    title: 'Avocado Toast with Poached Egg',
    image: '/recipes/avocado-toast.jpg',
    description: 'Crispy toast topped with avocado and poached egg.',
    author: { id: '104', name: 'Alex Green', avatar: '/avatars/chef-alex.jpg' },
    createdAt: '2024-02-08T00:00:00Z',
    updatedAt: '2024-02-08T00:00:00Z',
    cookingTime: 20,
    servings: 1,
    difficulty: 'Easy',
    category: ['Brunch'],
    ingredients: [
      { name: 'Ingredient A', quantity: 1, unit: 'cup' },
      { name: 'Ingredient B', quantity: 2, unit: 'pieces' },
      { name: 'Ingredient C', quantity: 0.5, unit: 'teaspoon' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Prep all ingredients.', duration: 5 },
      { stepNumber: 2, instruction: 'Cook until golden brown.', duration: 15 },
      { stepNumber: 3, instruction: 'Serve and enjoy.', duration: 5 }
    ],
    tags: ['brunch', 'avocado', 'healthy'],
    nutrition: { calories: 460, protein: 22, carbs: 46, fat: 19, fiber: 3 },
    rating: 4.5,
    reviewCount: 125,
    savedBy: [],
    likes: 0,
    likedBy: [],
    comments: []
  },
  {
    id: '10',
    title: 'Strawberry Cheesecake',
    image: '/recipes/strawberry-cheesecake.jpg',
    description: 'Rich cheesecake with a strawberry topping.',
    author: { id: '108', name: 'Emily Hart', avatar: '/avatars/chef-emily.jpg' },
    createdAt: '2024-02-09T00:00:00Z',
    updatedAt: '2024-02-09T00:00:00Z',
    cookingTime: 33,
    servings: 2,
    difficulty: 'Medium',
    category: ['Dessert'],
    ingredients: [
      { name: 'Ingredient A', quantity: 1, unit: 'cup' },
      { name: 'Ingredient B', quantity: 2, unit: 'pieces' },
      { name: 'Ingredient C', quantity: 0.5, unit: 'teaspoon' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Prep all ingredients.', duration: 5 },
      { stepNumber: 2, instruction: 'Cook until golden brown.', duration: 15 },
      { stepNumber: 3, instruction: 'Serve and enjoy.', duration: 5 }
    ],
    tags: ['dessert', 'baked', 'cheesecake'],
    nutrition: { calories: 265, protein: 16, carbs: 42, fat: 25, fiber: 2 },
    rating: 4.9,
    reviewCount: 187,
    savedBy: [],
    likes: 2,
    likedBy: ["user123", "user456"],
    comments: []
  }
];

export default mockRecipes;