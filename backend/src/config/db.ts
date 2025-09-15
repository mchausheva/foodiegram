import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import { UserModel, CategoryModel, RecipeModel } from '../db/models';
import mockRecipes from '../mockData/recipes';
import seedCategories from '../data/categories';

export const connectDb = async () => {
  const uri = process.env.MONGO_URI || '';
  if (!uri) {
    console.warn('MONGO_URI not set; skipping DB connection');
    return;
  }
  await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  await seedInitialData();
};

const seedInitialData = async () => {
  // Seed admin user
  const adminEmail = 'admin@foodiegram';
  const existingAdmin = await UserModel.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const admin = new UserModel({
      username: 'admin',
      email: adminEmail,
      password: await bcrypt.hash('admin123', 10),
      avatar: '/avatars/default.png',
      role: 'admin',
      active: true,
      joinedAt: new Date().toISOString()
    });
    await admin.save();
  }

  // Seed categories
  const countCats = await CategoryModel.countDocuments();
  if (countCats === 0) {
    await CategoryModel.insertMany(
      Array.from(new Set(seedCategories)).map((name) => ({ name }))
    );
  }

  // Seed recipes if empty
  const countRecipes = await RecipeModel.countDocuments();
  if (countRecipes === 0) {
    const admin = await UserModel.findOne({ email: adminEmail });
    await RecipeModel.insertMany(
      mockRecipes.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        image: r.image,
        author: {
          id: r.author.id,
          name: r.author.name,
          avatar: r.author.avatar,
        },
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        cookingTime: r.cookingTime,
        servings: r.servings,
        difficulty: r.difficulty,
        category: r.category,
        ingredients: r.ingredients,
        steps: r.steps,
        tags: r.tags,
        nutrition: r.nutrition,
        rating: r.rating || 0,
        reviewCount: r.reviewCount || 0,
        savedBy: r.savedBy || [],
        likes: r.likes || 0,
        likedBy: r.likedBy || [],
        comments: r.comments || [],
        status: 'approved'
      }))
    );
  }
};


