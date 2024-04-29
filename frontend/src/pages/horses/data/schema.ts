import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const horseSchema = z.object({
  id: z.number(),
  given_name: z.string(),
  gender_id: z.number(),
})

export type Horse = z.infer<typeof horseSchema>
