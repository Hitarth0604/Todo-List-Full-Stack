package com.todo.todo_backend.Services;

import org.quartz.SchedulerException;

import com.todo.todo_backend.Model.SchedulerModel;

public interface  SchedulerService {

    String scheduleStartReminders(SchedulerModel schedulerModel) throws SchedulerException;
    String scheduleCompletionReminders(SchedulerModel schedulerModel) throws SchedulerException;
}
