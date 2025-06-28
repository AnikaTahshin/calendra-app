import { is } from 'drizzle-orm'
import { duration } from 'drizzle-orm/gel-core'
import React from 'react'
import { z } from 'zod'

export const eventsFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    isActive: z.boolean(),
    durationInMinutes: z.coerce.number().int().positive("Duration must be greater than 0")
        .max(60* 12, `Duration must be at less than 12 hours (${60 * 12} minutes)`),
    
  
}
)
