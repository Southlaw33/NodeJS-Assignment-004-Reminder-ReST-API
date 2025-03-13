import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import ReminderDataBase from './reminder';

const app = new Hono();

const db = new ReminderDataBase();

//creating reminder
app.post("/reminders", async (c) => {
  const { title, date, description } = await c.req.json();
  if (!title || !date  ) return c.json({ error: "Invalid data" }, 400);
  
  const id = db.createReminder(title, new Date(date), description); // Get generated ID
  return c.json({ message: `Reminder "${title}" is stored` }, 201);
});


app.get("/reminders", (c) => {
  const reminders = db.getAllReminders();
  return reminders && reminders.length 
    ? c.json(reminders.map(r => ({ id: r.id, title: r.title, date: r.dueDate, description: r.description, completed: r.completed }))) 
    : c.json({ error: "No reminders found" }, 404);
});

app.get("/reminders/ids", (c) => {
  const reminders = db.getAllReminders();
  if (!reminders) {
    return c.json({ error: "No reminders found" }, 404);
  }
  const ids = reminders.map(r => r.id.toString());
  return ids.length ? c.json({ reminderIDs: ids }) : c.json({ error: "No reminders found" }, 404);
});

app.get("/reminders/:id", (c) => {
  const reminder = db.getReminder(c.req.param("id"));
  return reminder ? c.json(reminder) : c.json({ error: "Reminder not found" }, 404);
});

serve(app);
console.log("Server running!!");