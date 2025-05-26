package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // 추후 로그인 연동되면 User 객체로 대체 가능

    private double latitude;
    private double longitude;

    private LocalDateTime timestamp;
}
