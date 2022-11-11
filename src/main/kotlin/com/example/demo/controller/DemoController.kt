package com.example.demo.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class DemoController {
    @ResponseBody
    @RequestMapping("/hello")
    fun helloWorld() = "Hello World!"
}