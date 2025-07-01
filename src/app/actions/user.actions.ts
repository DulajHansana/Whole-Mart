
'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

type PlainUser = Omit<IUser, '_id' | 'password'> & { id: string };
type CreateUserInput = Omit<IUser, 'id'>;
type UpdateUserInput = Partial<CreateUserInput>;
type LoginUserInput = Pick<IUser, 'email' | 'password'>;


// Helper to convert Mongoose doc to plain object and map _id to id
const toPlainObject = (doc: mongoose.Document | mongoose.Document[] | null): PlainUser | PlainUser[] | null => {
  if (!doc) return doc;
  const plain = JSON.parse(JSON.stringify(doc));
  if (Array.isArray(plain)) {
    return plain.map(item => {
      if (item._id) {
        item.id = item._id.toString();
        // delete item._id;
      }
      return item;
    });
  }
  if (plain._id) {
    plain.id = plain._id.toString();
    // delete plain._id;
  }
  return plain;
};

const handleDbError = (error: unknown) => {
    console.error("Database Action Error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
        const errorMessages = Object.values(error.errors).map(e => e.message).join(' ');
        return { success: false, message: `Validation Error: ${errorMessages}` };
    }

    if (error && typeof error === 'object') {
        const err = error as { name?: string; code?: number; message?: string };
        if (err.name === 'MongoServerError' && (err.code === 8000 || (err.message && err.message.includes('authentication failed')))) {
            return { success: false, message: "Database authentication failed. Please check your MONGODB_URI credentials." };
        }
        
        if (err.name === 'MongooseServerSelectionError') {
           return { success: false, message: "Could not connect to the database. Check your network settings and ensure your server's IP address is whitelisted in MongoDB Atlas." };
        }
        
        if (err.code === 11000) {
          return { success: false, message: "An account with this email already exists." };
        }

        if (err.message) {
            return { success: false, message: err.message || "A database error occurred. Please try again later." };
        }
    }
    
    return { success: false, message: "An unknown database error occurred. Please try again later." };
}

export async function createUser(data: CreateUserInput) {
  try {
    await dbConnect();

    if (!data.password) {
      return { success: false, message: "Password is required." };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      ...data,
      password: hashedPassword,
    });

    await newUser.save();
    revalidatePath('/dashboard/users');
    return { success: true, data: toPlainObject(newUser) as PlainUser };
  } catch (error: unknown) {
    return handleDbError(error);
  }
}

export async function getUsers() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return { success: true, data: toPlainObject(users) as PlainUser[] };
  } catch (error: unknown) {
    return handleDbError(error);
  }
}

export async function updateUser(userId: string, data: UpdateUserInput) {
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
    return { success: true, data: toPlainObject(updatedUser) as PlainUser };
  } catch (error: unknown) {
    return handleDbError(error);
  }
}

export async function deleteUser(userId: string) {
    try {
        await dbConnect();
        await User.findByIdAndDelete(userId);
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (error: unknown) {
        return handleDbError(error);
    }
}


export async function loginUser(credentials: LoginUserInput) {
    try {
        await dbConnect();
        if (!credentials.email || !credentials.password) {
            return { success: false, message: 'Invalid credentials.' };
        }

        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
            return { success: false, message: 'Invalid credentials.' };
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password!);

        if (!isMatch) {
            return { success: false, message: 'Invalid credentials.' };
        }
        
        const userObject = toPlainObject(user) as PlainUser;
        // The password field is already excluded by toPlainObject logic, but this is an extra safeguard
        if ('password' in userObject) {
            delete (userObject as { password?: string }).password;
        }

        return { success: true, user: userObject };

    } catch (error: unknown) {
        return handleDbError(error);
    }
}
