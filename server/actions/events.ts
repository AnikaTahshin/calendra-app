"use server";

import { db } from "@/drizzle/db";
import { eventTable } from "@/drizzle/schema";
import { eventsFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function createEvent(
  unsafeData: z.infer<typeof eventsFormSchema>
): Promise<void> {
  try {
    const { userId } = await auth(); 
    const { success, data } = eventsFormSchema.safeParse(unsafeData);
    if (!success || !userId) {
      throw new Error("Invalid event data or user not authenticated");
    }

   await db.insert(eventTable).values({ ...data, clerkUserId: userId });
  } catch (error:any) {
          throw new Error(`Failed to create event: ${error.message || error}`)

  } finally {
    revalidatePath("/events");
    // redirect("/events");
  }
}

export async function updateEvent(
  id: string,
  unsafeData: z.infer<typeof eventsFormSchema>
): Promise<void> {
  try {
    const { userId } = await auth();
    const { success, data } = eventsFormSchema.safeParse(unsafeData);
    if (!success || !userId) {
      throw new Error("Invalid event data or user not authenticated");
    }

    const { rowCount } = await db
      .update(eventTable)
      .set({ ...data })
      .where(and(eq(eventTable.id, id), eq(eventTable.clerkUserId, userId)));
    if (rowCount === 0) {
      throw new Error(
        "Event not found or you do not have permission to update this event"
      );
    }
  } catch (error) {
    throw new Error(
      `There was an error updating the event: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    revalidatePath("/events");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const { rowCount } = await db
      .delete(eventTable)
      .where(and(eq(eventTable.id, id), eq(eventTable.clerkUserId, userId)));

    if (rowCount === 0) {
      throw new Error(
        "Event not found or user not authorized to delete this event."
      );
    }
  } catch (error: any) {
    throw new Error(`Failed to delete event: ${error.message || error}`);
  } finally {
    revalidatePath("/events");
  }
}


// created events lists
export async function getEvents(userId: string):<Promise<EventRow[]> {
  try {
    const events = await db
      .select()
      .from(eventTable)
      .where(eq(eventTable.clerkUserId, userId));
    return events;
  } catch (error: any) {
    throw new Error(`Failed to fetch events: ${error.message || error}`);
  }
}   
