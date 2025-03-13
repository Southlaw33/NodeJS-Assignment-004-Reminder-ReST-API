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


//retrieval of all reminders
app.get("/reminders/ids", (c) => {
  const reminders = db.getAllReminders();
  if (!reminders) {
    return c.json({ error: "No reminders found" }, 404);
  }
  const ids = reminders.map(r => r.id.toString());
  return ids.length ? c.json({ reminderIDs: ids }) : c.json({ error: "No reminders found" }, 404);
});


//retrieval of reminder based on id
app.get("/reminders/:id", (c) => {
  const reminder = db.getReminder(c.req.param("id"));
  return reminder ? c.json(reminder) : c.json({ error: "Reminder not found" }, 404);
});


//updating the reminder based on id
app.patch("/reminders/:id", async (c) => {
  const id = c.req.param("id");
  if (!db.exists(id)) return c.json({ error: "Reminder not found" }, 404);
  
  const { title, date, description } = await c.req.json();
  db.updateReminder(id, title, date, description );
  return c.json({ message: "Reminder updated successfully" });
});


//deleting the reminder based on id
app.delete("/reminders/:id", (c) => {
  const id = c.req.param("id");
  if (!db.exists(id)) return c.json({ error: "Reminder not found" }, 404);
  
  db.removeReminder(id);
  return c.json({ message: "Reminder deleted successfully" });
});


//marking a reminder as completed
app.post("/reminders/:id/mark-completed", (c) => {
  const id = c.req.param("id");
  if (!db.exists(id)) return c.json({ error: "Reminder not found" }, 404);
  
  db.markReminderAsCompleted(id);
  return c.json({ message: "Reminder marked as completed" });
});


//unmarking a reminder as completed
app.post("/reminders/:id/unmark-completed", (c) => {
  const id = c.req.param("id");
  if (!db.exists(id)) return c.json({ error: "Reminder not found" }, 404);
  
  db.unmarkReminderAsCompleted(id);
  return c.json({ message: "Reminder unmarked as completed" });
});


//retrieve all reminders which are marked as completed
app.get("/rc", (c) => { //changed the endpoint as i was getting errors ; renamed rc from reminders/completed
  const reminders = db.getAllRemindersMarkedAsCompleted();
   if(reminders && reminders.length > 0) {return  c.json(reminders)} else{ return c.json({error: "No completed reminders found" }, 404);}});


//retrieve all reminders which are not marked as completed
app.get("/rnc", (c) => { //changed the endpoint as i was getting errors ; renamed rnc from reminders/not-completed
  const reminders = db.getAllRemindersNotMarkedAsCompleted();
  return reminders && reminders.length ? c.json(reminders) : c.json({ error: "No uncompleted reminders found" }, 404);
});


//retrieving all reminders which are due by today
app.get("/rdt", (c) => {  //same issue of the endpoint ; renamed the endpoint as rdt from reminders/due-today
  const reminders = db.getAllRemindersDueByToday();
  return reminders && reminders.length ? c.json(reminders) : c.json({ error: "No reminders due today" }, 404);
});


serve(app);
console.log("Server running!!");


