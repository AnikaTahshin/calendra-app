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


type EventRow = typeof eventTable.$inferSelect

// created events lists
export async function getEvents(clerkUserId: string):Promise<EventRow[]> {
  try {
    const events = await db.query.eventTable.findMany({
        where: ({clerkUserId:userIdCol}, {eq}) => eq(userIdCol, clerkUserId),
        orderBy:({name}, {asc, sql}) => asc(sql`lower(${name})`),
    })
    return events;
      
  } catch (error: any) {
    throw new Error(`Failed to fetch events: ${error.message || error}`);
  }
}   



// getEvent by id
export async function getEvent(userId: string, eventId: string): Promise<EventRow | undefined> {
  const event = await db.query.eventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)), // Make sure the event belongs to the user
  })

  return event ?? undefined // Explicitly return undefined if not found
}



// public events
export type PublicEvent = Omit<EventRow, "isActive"> & { isActive: true }

export async function getPublicEvents(clerkUserId: string): Promise<PublicEvent[]> {
  // Query the database for events where:
  // - the clerkUserId matches
  // - the event is marked as active
  // Events are ordered alphabetically (case-insensitive) by name
  const events = await db.query.eventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  // Cast the result to the PublicEvent[] type to indicate all are active
  return events as PublicEvent[]
}
