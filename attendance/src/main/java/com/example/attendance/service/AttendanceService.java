package com.example.attendance.service;

import com.example.attendance.dto.AttendanceRequest;
import com.example.attendance.dto.AttendanceResponse;
import com.example.attendance.model.AttendanceRecord;
import com.example.attendance.repository.AttendanceRepository;
import com.example.attendance.util.GeoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    // 기준 위치
    private final double targetLat = 35.2303;
    private final double targetLng = 129.0842;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public AttendanceResponse checkAttendance(AttendanceRequest request) {
        double distance = GeoUtils.calculateDistance(
                request.getLatitude(),
                request.getLongitude(),
                targetLat,
                targetLng
        );

        if (distance > 100) {
            return new AttendanceResponse(false, "출석 실패: 범위 초과");
        }

        String username = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        // ✅ 오늘 날짜 범위 계산
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);

        // ✅ 오늘 이미 출석한 적 있는지 확인
        boolean alreadyChecked = attendanceRepository.existsByUsernameAndTimestampBetween(
                username, startOfDay, endOfDay
        );

        if (alreadyChecked) {
            return new AttendanceResponse(false, "이미 오늘 출석했습니다.");
        }

        // ✅ 처음 출석이라면 저장
        AttendanceRecord record = AttendanceRecord.builder()
                .username(username)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .timestamp(LocalDateTime.now())
                .build();

        attendanceRepository.save(record);

        return new AttendanceResponse(true, "출석 완료");
    }

    public List<AttendanceRecord> getTodayAttendanceList() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        return attendanceRepository.findAllByTimestampBetween(startOfDay, endOfDay);
    }

}

