package com.todo.todo_backend.JobScheduler;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.quartz.JobDataMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

public class DemoScheduler implements Job {

    private final Logger logger = LoggerFactory.getLogger(DemoScheduler.class);

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap dataMap = context.getJobDetail().getJobDataMap();
        String city = dataMap.getString("city");

        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city
                + "&appid=612472c86c8920f4a4a5c7aa53a12b47";
        RestTemplate restTemplate = new RestTemplate();

        try {
            logger.info("Fetching weather for city: {}", city);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String responseBody = response.getBody();

            JSONObject json = new JSONObject(responseBody);
            double tempKelvin = json.getJSONObject("main").getDouble("temp");
            double tempCelsius = tempKelvin - 273.15;

            System.out.println("\n Temperature in :"+city + " is : "+ tempCelsius + "\n");

        } catch (Exception e) {
            System.out.println("Error fetching weather for " + city + ": " + e.getMessage());
        }
    }

}
