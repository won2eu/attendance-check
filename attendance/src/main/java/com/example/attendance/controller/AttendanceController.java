package com.example.attendance.controller;

import com.example.attendance.dto.AttendanceRequest;
import com.example.attendance.dto.AttendanceResponse;
import com.example.attendance.model.AttendanceRecord;
import com.example.attendance.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check") //ResponseEntity는 Http 상태 코드 헤더, 바디를 모두 담을 수 있는 응답 객체임.
    public ResponseEntity<AttendanceResponse> checkAttendance(@RequestBody AttendanceRequest request) {
        AttendanceResponse response = attendanceService.checkAttendance(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/today")
    public ResponseEntity<List<AttendanceRecord>> getTodayAttendance() {
        List<AttendanceRecord> records = attendanceService.getTodayAttendanceList();
        return ResponseEntity.ok(records);
    }

}
