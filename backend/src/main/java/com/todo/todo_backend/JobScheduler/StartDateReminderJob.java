package com.todo.todo_backend.JobScheduler;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class StartDateReminderJob implements Job {

    @Autowired
    JavaMailSender mailSender;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap dataMap = context.getJobDetail().getJobDataMap();
        String email = dataMap.getString("email");
        String todoDetail = dataMap.getString("todoDetail");
        String completionDate = dataMap.getString("completionDate");

        String subject = "Reminder: Your Todo Starts Today";
        String body = "You have the following work today: " + todoDetail +
                ". The completion date is " + completionDate + ".";
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setText(body);
        message.setSubject(subject);
        mailSender.send(message);

    }

}
