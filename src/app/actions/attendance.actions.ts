'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { differenceInMilliseconds } from 'date-fns';

const toPlainObject = (doc: any) => {
    const plain = JSON.parse(JSON.stringify(doc));
    if (plain._id) {
        plain.id = plain._id;
    }
    return plain;
};


const handleDbError = (error: any) => {
    console.error("Database Action Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
        const errorMessages = Object.values(error.errors).map(e => e.message).join(' ');
        return { success: false, message: `Validation Error: ${errorMessages}` };
    }
    return { success: false, message: error.message || "A database error occurred." };
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
        return { success: true, data: toPlainObject(newAttendance) };
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
        return { success: true, data: toPlainObject(updatedAttendance) };
    } catch (error) {
        return handleDbError(error);
    }
}


export async function getAttendanceRecords(userId: string) {
    try {
        await dbConnect();
        const records = await Attendance.find({ userId }).sort({ checkIn: -1 });
        return { success: true, data: toPlainObject(records) };
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

        return { success: true, data: toPlainObject(latestRecord) };
    } catch (error) {
        return handleDbError(error);
    }
}
