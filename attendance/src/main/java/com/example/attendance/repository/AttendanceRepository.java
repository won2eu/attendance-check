package com.example.attendance.repository;

import com.example.attendance.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {
    boolean existsByUsernameAndTimestampBetween(String username, LocalDateTime start, LocalDateTime end);
    List<AttendanceRecord> findAllByTimestampBetween(LocalDateTime start, LocalDateTime end);
}

