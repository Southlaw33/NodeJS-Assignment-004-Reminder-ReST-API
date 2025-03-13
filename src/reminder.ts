class reminder{
    id: number;
    title: string;
    date: Date;
    completed: boolean = false;
    constructor(id: number, title: string, date: Date){
        this.id = id;
        this.title = title;
        this.date = date;
    }
}

class ReminderDataBase{
    reminders: Map<String, reminder> = new Map();
    createReminder(title: string, date: Date){
        const id = Math.floor(Math.random() * 1000);
        const rem = new reminder(id, title, date);
        this.reminders.set(id.toString(), rem);
    }
    getAllReminders(): reminder[] | null{
        return Array.from(this.reminders.values());
    }
    getReminder(id: string): reminder | null{
        return this.reminders.get(id) || null;
    }

    removeReminder(id: string){
        this.reminders.delete(id);
    }
    updateReminder(id: string, title: string, date: Date){ 
        const rem = this.reminders.get(id);
        if(rem){
            if(title){
                rem.title = title;
            }
            if(date){
                rem.date = date;
            }
            this.reminders.set(id, rem);

        }   
    }

    getAllRemindersDueByToday(): reminder[] | null {
        const today = new Date();
        const reminders = this.getAllReminders();
        if (reminders) {
            return reminders.filter(rem => rem.date.getDate() === today.getDate());
        }
        return null;
    }

    getAllRemindersMarkedAsCompleted(): reminder[] | null {
        const reminders = this.getAllReminders();
        if (reminders) {
            return reminders.filter(rem => rem.completed);
        }
        return null;
    }
    getAllRemindersNotMarkedAsCompleted(): reminder[] | null {
        const reminders = this.getAllReminders();
        if (reminders) {
            return reminders.filter(rem => !rem.completed);
        }
        return null;
    }


    exists(id: string): boolean{
        return this.reminders.has(id);
    }
    markReminderAsCompleted(id: string){
        const rem = this.reminders.get(id);
        if(rem){
            rem.completed = true;
            this.reminders.set(id, rem);
        }
    }
    unmarkReminderAsCompleted(id: string){
        const rem = this.reminders.get(id);
        if(rem){
            rem.completed = false;
            this.reminders.set(id, rem);
        }
    }
     
}

export default ReminderDataBase;
