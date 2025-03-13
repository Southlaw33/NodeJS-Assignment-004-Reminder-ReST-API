import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import ReminderDataBase from './reminder';


const app = new Hono();


const db = new ReminderDataBase();

//creating reminder
app.post("/reminders", async (c) => {
  const { title, date } = await c.req.json();
  if (!title || !date) return c.json({ error: "Invalid data" }, 400);
  
  const id = db.createReminder(title, new Date(date)); // Get generated ID
  return c.json({ message: "Reminder created successfully", id }, 201);
});


app.get("/reminders", (c) => {
  const reminders = db.getAllReminders();
  return reminders && reminders.length ? c.json(reminders) : c.json({ error: "No reminders found" }, 404);
});









serve(app);
console.log("Server running!!");