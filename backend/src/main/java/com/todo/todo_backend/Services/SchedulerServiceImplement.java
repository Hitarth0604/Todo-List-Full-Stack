package com.todo.todo_backend.Services;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.todo_backend.JobScheduler.CompletionDateReminderJob;
import com.todo.todo_backend.JobScheduler.StartDateReminderJob;
import com.todo.todo_backend.Model.SchedulerModel;

@Service
public class SchedulerServiceImplement implements SchedulerService {

        @Autowired
        Scheduler scheduler;

        @Override
        public String scheduleStartReminders(SchedulerModel schedulerModel) throws SchedulerException {
                // Define job keys for start and completion reminders
                JobKey startJobKey = new JobKey(schedulerModel.getTodoDetail() + "_start", "todo-reminders");

                // Remove existing jobs if they exist
                if (scheduler.checkExists(startJobKey)) {
                        scheduler.deleteJob(startJobKey);
                }

                // StartDate Email Reminder Scheduler
                JobDetail startJob = JobBuilder.newJob(StartDateReminderJob.class)
                                .withIdentity(schedulerModel.getTodoDetail() + "_start", "todo-reminders")
                                .usingJobData("email", schedulerModel.getEmail())
                                .usingJobData("todoDetail", schedulerModel.getTodoDetail())
                                .usingJobData("completionDate", schedulerModel.getCompletionDate().toString())
                                .build();

                Trigger startTrigger = TriggerBuilder.newTrigger()
                                .withIdentity(schedulerModel.getTodoDetail() + "_start_trigger" + "todo-reminders")
                                .startAt(schedulerModel.getStartDate())
                                .build();

                scheduler.scheduleJob(startJob, startTrigger);

                return "Start Reminder Sent Successfully";
        }

        @Override
        public String scheduleCompletionReminders(SchedulerModel schedulerModel) throws SchedulerException {

                // CompletionDate Email Reminder Scheduler
                JobKey completionJobKey = new JobKey(schedulerModel.getTodoDetail() + "_completion", "todo-reminders");
                if (scheduler.checkExists(completionJobKey)) {
                        scheduler.deleteJob(completionJobKey);
                }

                JobDetail completionJob = JobBuilder.newJob(CompletionDateReminderJob.class)
                                .withIdentity(schedulerModel.getTodoDetail() + "_completion", "todo-reminders")
                                .usingJobData("email", schedulerModel.getEmail())
                                .usingJobData("todoDetail", schedulerModel.getTodoDetail())
                                .build();

                Trigger completionTrigger = TriggerBuilder.newTrigger()
                                .withIdentity(schedulerModel.getTodoDetail() + "_completion_trigger" + "todo-reminders")
                                .startAt(schedulerModel.getCompletionDate())
                                .build();

                scheduler.scheduleJob(completionJob, completionTrigger);

                return "Email Scheduled Successfully";
        }

}
