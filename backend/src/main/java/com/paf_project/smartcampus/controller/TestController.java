package com.paf_project.smartcampus.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/public/hello")
    public String publicHello() {
        return "Hello from public endpoint! No token needed";
    }

    @GetMapping("/private/hello")
    public String privateHello() {
        return "Hello from private endpoint! Something you shouldnt be seen boii🤣🤣🤣";
    }
    
    

}
