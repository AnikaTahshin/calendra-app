'use server';

import { db } from "@/drizzle/db";
import { eventTable } from "@/drizzle/schema";
import { eventsFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation'
import { z } from "zod";


export default async function createEvent  (
    unsafeData: z.infer<typeof eventsFormSchema>
):Promise<void>  {
    try {
        const {userId} = await auth()// Assuming userId is part of the unsafeData
        const {success, data} = eventsFormSchema.safeParse(unsafeData);
        if (!success || !userId) {
            throw new Error("Invalid event data or user not authenticated");
        }
        
        db.insert(eventTable).values({ ...data, clerkUserId: userId})
    } catch (error) {
        throw new Error(`There was an error creating the event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    finally{
        revalidatePath('/events');
        redirect('/events');
    }
  
}

export async function updateEvent(
    id: string,
    unsafeData: z.infer<typeof eventsFormSchema>
): Promise<void> {
    try {
        const {userId} = await auth();
        const {success, data} = eventsFormSchema.safeParse(unsafeData);
        if (!success || !userId) {
            throw new Error("Invalid event data or user not authenticated");
        }

       const {rowCount} = await db.update(eventTable).set({...data}).where(and(eq(eventTable.id, id), eq(eventTable.clerkUserId, userId)));
         if (rowCount === 0) {
                throw new Error("Event not found or you do not have permission to update this event");
          }
    
    } catch (error) {
        throw new Error(`There was an error updating the event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    finally{
        revalidatePath('/events');
        redirect('/events');
    }
}

