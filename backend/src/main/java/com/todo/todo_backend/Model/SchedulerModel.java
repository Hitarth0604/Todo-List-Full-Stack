package com.todo.todo_backend.Model;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchedulerModel {
    private String email;
    private String todoDetail;
    private Date startDate;
    private Date completionDate; 
}
