// event table 

import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { desc, relations } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { on } from "events";
const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date());

export const eventTable = pgTable("event", {
    id:uuid("id").primaryKey().defaultRandom(),
    name:text("name").notNull(),
    description:text("description"),
    durationInMinutes:integer("durationInMinutes").notNull(),
clerkUserId:text("clerkUserId").notNull(),
isActive:boolean("isActive").notNull().default(true),
createdAt,
updatedAt,
},


(table) => ([
index("clerkUserIdIndex").on(table.clerkUserId),
])
)

export const ScheduleTable = pgTable("schedules", {
    id: uuid("id").primaryKey().defaultRandom(),         
    timezone: text("timezone").notNull(),                
    clerkUserId: text("clerkUserId").notNull().unique(), 
    createdAt,                                           
    updatedAt,                                           
  })

    export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable), 
  }))

export const scheduleRelation = relations(ScheduleTable, ({many}) => ({
    availibilities: many(ScheduleAvailabilityTable)
}))




export const scheduleDayOfWeek = pgEnum("day",DAYS_OF_WEEK_IN_ORDER)


export const ScheduleAvailabilityTable = pgTable("scheduleAvailabilities", {
    id:uuid("id").primaryKey().defaultRandom(),
    scheduleId:uuid("scheduleId").notNull().references(() => ScheduleTable.id, {onDelete:"cascade"}), 
    startTime:text("startTime").notNull(),
    endTime:text("endTime").notNull(),
    dayOfWeek : scheduleDayOfWeek("dayOfWeek").notNull(), // Assuming you have a custom type for day of the week
    createdAt,
    updatedAt
    
}, table => ([
    index("scheduleIdIndex").on(table.scheduleId)
])
)

export const SchedulAvailibilityRelations = relations(ScheduleAvailabilityTable, 
    ({one}) => ({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId],
        references: [ScheduleTable.id],
})
})
)