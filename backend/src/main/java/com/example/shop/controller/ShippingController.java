package com.example.shop.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Shipping Controller — Mock GHN integration.
 * Khi có GHN API Token: thay MOCK_SHIPPING_FEES bằng call thực tới GHN.
 *
 * POST /api/shipping/calculate
 * Body: { "province": "Hà Nội" }
 * Response: { "fee": 30000, "estimatedDays": 1, "provider": "GHN Mock" }
 */
@RestController
@RequestMapping("/api/shipping")
@RequiredArgsConstructor
public class ShippingController {

    // ─── Mock phí ship theo khu vực ───
    // Cấu trúc: province keyword → fee (VNĐ)
    private static final Map<String, Integer> ZONE_FEES = Map.ofEntries(
            Map.entry("hà nội",     25_000),
            Map.entry("hồ chí minh", 25_000),
            Map.entry("đà nẵng",    30_000),
            Map.entry("hải phòng",  30_000),
            Map.entry("cần thơ",    35_000),
            Map.entry("bình dương", 30_000),
            Map.entry("đồng nai",   30_000),
            Map.entry("khánh hòa",  35_000),
            Map.entry("thừa thiên", 35_000)
    );

    private static final Map<String, Integer> ZONE_DAYS = Map.ofEntries(
            Map.entry("hà nội",      1),
            Map.entry("hồ chí minh", 1),
            Map.entry("đà nẵng",     2),
            Map.entry("hải phòng",   1),
            Map.entry("cần thơ",     2),
            Map.entry("bình dương",  2),
            Map.entry("đồng nai",    2),
            Map.entry("khánh hòa",   3),
            Map.entry("thừa thiên",  3)
    );

    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculate(@RequestBody Map<String, String> body) {
        String province = (body.getOrDefault("province", "")).toLowerCase().trim();

        int fee = 45_000;       // Default: tỉnh xa
        int days = 4;

        for (Map.Entry<String, Integer> entry : ZONE_FEES.entrySet()) {
            if (province.contains(entry.getKey())) {
                fee = entry.getValue();
                days = ZONE_DAYS.getOrDefault(entry.getKey(), 3);
                break;
            }
        }

        return ResponseEntity.ok(Map.of(
                "fee", fee,
                "estimatedDays", days,
                "provider", "GHN (Mock)",
                "note", "Tích hợp GHN thực sẽ được kích hoạt khi có API Token"
        ));
    }
}
