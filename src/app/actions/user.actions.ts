'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Helper to convert Mongoose doc to plain object
const toPlainObject = (doc: any) => {
  const plain = JSON.parse(JSON.stringify(doc));
  return plain;
};

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
    return { success: false, message: error.message };
  }
}

export async function getUsers() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return { success: true, data: toPlainObject(users) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteUser(userId: string) {
    try {
        await dbConnect();
        await User.findByIdAndDelete(userId);
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
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
        
        // In a real app, you'd create a session/JWT here.
        // For now, we just confirm login is successful.
        return { success: true, message: "Login successful" };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
