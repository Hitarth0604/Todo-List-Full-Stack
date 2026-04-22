package com.todo.todo_backend.Configuration;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;

@Component
public class SchedulerShutdownHandler {

    private final Logger logger = LoggerFactory.getLogger(SchedulerShutdownHandler.class);

    @Autowired
    Scheduler scheduler;

    @PreDestroy
    public void shutdownScheduler() {
        try {
            if (!scheduler.isShutdown()) {
                scheduler.shutdown(true);
                logger.info("Quartz Scheduler shut down successfully.");
                System.out.println("Quartz Scheduler shut down.");
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
}
