import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const todoSchema = z.object({
  id: z.number(),
  text: z.string(),
})

export type Todo = z.infer<typeof todoSchema>
