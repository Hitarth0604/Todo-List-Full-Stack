package com.todo.todo_backend.JobScheduler;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class CompletionDateReminderJob implements Job {

    @Autowired
    JavaMailSender mailSender;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
        String email = jobDataMap.getString("email");
        String todoDetail = jobDataMap.getString("todoDetail");

        String subject = "Reminder: Todo Completion Due Today";
        String body = "Today is the last date for your todo: " + todoDetail +
                ". If it's not completed yet, please complete it as soon as possible. If completed, all the best for future work.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setText(body);
        message.setSubject(subject);
        mailSender.send(message);
    }

}
