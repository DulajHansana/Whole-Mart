
'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Attendance, { IAttendance } from '@/models/Attendance';
import { differenceInMilliseconds } from 'date-fns';

type PlainAttendance = Omit<IAttendance, '_id' | 'userId'> & { id: string, userId: string };

const toPlainObject = (doc: mongoose.Document | mongoose.Document[] | null): PlainAttendance | PlainAttendance[] | null => {
    if (!doc) return doc;
    const plain = JSON.parse(JSON.stringify(doc));
    if (Array.isArray(plain)) {
        return plain.map(item => {
            if (item._id) {
                item.id = item._id.toString();
                // delete item._id; // Optionally delete, but mapping to id is enough
            }
            if (item.userId) {
                item.userId = item.userId.toString();
            }
            return item;
        });
    }
    if (plain._id) {
        plain.id = plain._id.toString();
        // delete plain._id;
    }
    if (plain.userId) {
        plain.userId = plain.userId.toString();
    }
    return plain;
};


const handleDbError = (error: unknown) => {
    console.error("Database Action Error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
        const errorMessages = Object.values(error.errors).map(e => e.message).join(' ');
        return { success: false, message: `Validation Error: ${errorMessages}` };
    }
    
    // Using type guards for other error types
    if (error && typeof error === 'object') {
        const err = error as { name?: string; code?: number; message?: string };
        if (err.name === 'MongoServerError' && (err.code === 8000 || (err.message && err.message.includes('authentication failed')))) {
            return { success: false, message: "Database authentication failed. Please check your MONGODB_URI credentials." };
        }
        
        if (err.name === 'MongooseServerSelectionError') {
           return { success: false, message: "Could not connect to the database. Check your network settings and ensure your server's IP address is whitelisted in MongoDB Atlas." };
        }
        
        if (err.message) {
            return { success: false, message: err.message || "A database error occurred. Please try again later." };
        }
    }
    
    return { success: false, message: "An unknown database error occurred. Please try again later." };
}

export async function checkIn(userId: string) {
    try {
        await dbConnect();
        const newAttendance = new Attendance({
            userId,
            checkIn: new Date(),
        });
        await newAttendance.save();
        revalidatePath('/dashboard/attendance');
        revalidatePath('/dashboard');
        return { success: true, data: toPlainObject(newAttendance) as PlainAttendance };
    } catch (error) {
        return handleDbError(error);
    }
}

export async function checkOut(attendanceId: string) {
    try {
        await dbConnect();
        const checkOutTime = new Date();
        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            return { success: false, message: 'Attendance record not found.' };
        }
        
        const durationInMs = differenceInMilliseconds(checkOutTime, attendance.checkIn);
        const totalHours = parseFloat((durationInMs / (1000 * 60 * 60)).toFixed(2));

        const updatedAttendance = await Attendance.findByIdAndUpdate(
            attendanceId,
            { checkOut: checkOutTime, totalHours },
            { new: true }
        );
        
        revalidatePath('/dashboard/attendance');
        revalidatePath('/dashboard');
        return { success: true, data: toPlainObject(updatedAttendance) as PlainAttendance };
    } catch (error) {
        return handleDbError(error);
    }
}


export async function getAttendanceRecords(userId: string) {
    try {
        await dbConnect();
        const records = await Attendance.find({ userId }).sort({ checkIn: -1 });
        return { success: true, data: toPlainObject(records) as PlainAttendance[] };
    } catch (error) {
        return handleDbError(error);
    }
}

export async function getLatestAttendanceRecord(userId: string) {
    try {
        await dbConnect();
        const latestRecord = await Attendance.findOne({ userId }).sort({ checkIn: -1 });
        
        if (!latestRecord) {
            return { success: true, data: null };
        }

        return { success: true, data: toPlainObject(latestRecord) as PlainAttendance };
    } catch (error) {
        return handleDbError(error);
    }
}

export async function deleteAttendanceRecord(attendanceId: string) {
    try {
        await dbConnect();
        await Attendance.findByIdAndDelete(attendanceId);
        revalidatePath('/dashboard/attendance');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return handleDbError(error);
    }
}
