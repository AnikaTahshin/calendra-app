'use server'

import { db } from "@/drizzle/db";
import { meetingActionSchema } from "@/schema/meetings";
import { fromZonedTime } from "date-fns-tz";
import { getValidTimesFromSchedule } from "./schedule";
import { z } from "zod";
import { createCalendarEvent } from "../google/googleCalender";

//Server action to create a meeting
export async function createMeeting(
  unsafeData: z.infer<typeof meetingActionSchema> // Incoming data, inferred from the meetingActionSchema
) {


  try {
    const { success, data } = meetingActionSchema.safeParse(unsafeData);

    if (!success) {
      throw new Error("Invalid data.");
    }

    // find the event in the database that matches the provided IDs and is active
    const event = await db.query.eventTable.findFirst({
      where: ({ clerkUserId, isActive, id }, { eq, and }) =>
        and(
          eq(isActive, true), 
          eq(clerkUserId, data.clerkUserId), 
          eq(id, data.eventId) 
        ),
    });

    if (!event) {
      throw new Error("Event not found.");
    }

    // Interpret the start time as being in the user's timezone and convert it to a UTC Date
    const startInTimezone = fromZonedTime(data.startTime, data.timezone);

    // Check if the selected time is valid for the event's availability
    const validTimes = await getValidTimesFromSchedule([startInTimezone], event);

    if (validTimes.length === 0) {
      throw new Error("Selected time is not valid.");
    }

    // Create the Google Calendar event with all necessary details
    await createCalendarEvent({
      ...data, 
      startTime: startInTimezone, 
      durationInMinutes: event.durationInMinutes,
      eventName: event.name,
    });
    return {clerkUserId: data.clerkUserId, eventId : data.eventId, startTime: data.startTime}
  } catch (error: any) {
    console.error(`Error creating meeting: ${error.message || error}`);
    throw new Error(`Failed to create meeting: ${error.message || error}`);
  }
}