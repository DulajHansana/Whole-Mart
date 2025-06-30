'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Helper to convert Mongoose doc to plain object
const toPlainObject = (doc: any) => {
  const plain = JSON.parse(JSON.stringify(doc));
  return plain;
};

const handleDbError = (error: any) => {
    console.error("Database Action Error:", error);

    // Authentication failed
    if (error.name === 'MongoServerError' && (error.code === 8000 || (error.message && error.message.includes('authentication failed')))) {
        return { success: false, message: "Authentication Failed: The username or password in your .env.local file is incorrect. Please verify your database user credentials in MongoDB Atlas." };
    }
    
    // Duplicate key error
    if (error.code === 11000) {
      return { success: false, message: "An account with this email already exists." };
    }

    // Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
        const errorMessages = Object.values(error.errors).map(e => e.message).join(' ');
        return { success: false, message: `Validation Error: ${errorMessages}` };
    }

    // Generic fallback
    return { success: false, message: error.message || "A database error occurred. Please try again later." };
}

export async function createUser(data: any) {
  try {
    await dbConnect();

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      ...data,
      password: hashedPassword,
    });

    await newUser.save();
    revalidatePath('/dashboard/users');
    return { success: true, data: toPlainObject(newUser) };
  } catch (error: any) {
    return handleDbError(error);
  }
}

export async function getUsers() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return { success: true, data: toPlainObject(users) };
  } catch (error: any) {
    return handleDbError(error);
  }
}

export async function updateUser(userId: string, data: any) {
  try {
    await dbConnect();

    const updateData = { ...data };

    if (updateData.password && updateData.password.trim() !== '') {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return { success: false, message: 'User not found.' };
    }

    revalidatePath('/dashboard/users');
    return { success: true, data: toPlainObject(updatedUser) };
  } catch (error: any) {
    return handleDbError(error);
  }
}

export async function deleteUser(userId: string) {
    try {
        await dbConnect();
        await User.findByIdAndDelete(userId);
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (error: any) {
        return handleDbError(error);
    }
}


export async function loginUser(credentials: any) {
    try {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
            return { success: false, message: 'Invalid credentials.' };
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password!);

        if (!isMatch) {
            return { success: false, message: 'Invalid credentials.' };
        }
        
        const userObject = toPlainObject(user);
        delete userObject.password;

        return { success: true, user: userObject };

    } catch (error: any) {
        return handleDbError(error);
    }
}
