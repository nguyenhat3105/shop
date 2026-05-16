package com.example.shop.controller;

import com.example.shop.entity.Order;
import com.example.shop.entity.Product;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/export")
@RequiredArgsConstructor
public class ExportController {

    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter FILE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmm");

    /** GET /api/admin/export/orders?from=2024-01-01&to=2024-12-31 */
    @GetMapping("/orders")
    public ResponseEntity<byte[]> exportOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) throws Exception {

        LocalDateTime start = from != null ? from.atStartOfDay() : LocalDateTime.now().minusMonths(1);
        LocalDateTime end   = to   != null ? to.atTime(23, 59, 59) : LocalDateTime.now();

        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Đơn hàng");

            // Style: header
            CellStyle headerStyle = wb.createCellStyle();
            Font hf = wb.createFont();
            hf.setBold(true); hf.setFontHeightInPoints((short) 11);
            headerStyle.setFont(hf);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Font wf = wb.createFont(); wf.setColor(IndexedColors.WHITE.getIndex()); wf.setBold(true);
            headerStyle.setFont(wf);

            // Title
            Row title = sheet.createRow(0);
            Cell tc = title.createCell(0);
            tc.setCellValue("DANH SÁCH ĐƠN HÀNG — " + start.toLocalDate() + " đến " + end.toLocalDate());
            CellStyle titleStyle = wb.createCellStyle();
            Font tf = wb.createFont(); tf.setBold(true); tf.setFontHeightInPoints((short) 14);
            titleStyle.setFont(tf);
            tc.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));

            // Header row
            String[] headers = {"#", "Mã đơn", "Khách hàng", "Email", "Số điện thoại", "Tổng tiền", "Trạng thái", "Ngày đặt"};
            Row hr = sheet.createRow(2);
            for (int i = 0; i < headers.length; i++) {
                Cell c = hr.createCell(i);
                c.setCellValue(headers[i]);
                c.setCellStyle(headerStyle);
            }

            // Data rows
            CellStyle moneyStyle = wb.createCellStyle();
            DataFormat df = wb.createDataFormat();
            moneyStyle.setDataFormat(df.getFormat("#,##0"));

            int rowNum = 3;
            for (int i = 0; i < orders.size(); i++) {
                Order o = orders.get(i);
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(o.getId());
                row.createCell(2).setCellValue(o.getCustomerName());
                row.createCell(3).setCellValue(o.getCustomerEmail());
                row.createCell(4).setCellValue(o.getPhone() != null ? o.getPhone() : "");
                Cell moneyCell = row.createCell(5);
                moneyCell.setCellValue(o.getTotalAmount().doubleValue());
                moneyCell.setCellStyle(moneyStyle);
                row.createCell(6).setCellValue(o.getStatus().name());
                row.createCell(7).setCellValue(o.getCreatedAt().format(DATE_FMT));
            }

            // Summary row
            Row sumRow = sheet.createRow(rowNum + 1);
            sumRow.createCell(4).setCellValue("TỔNG:");
            Cell sumCell = sumRow.createCell(5);
            sumCell.setCellFormula("SUM(F4:F" + rowNum + ")");
            sumCell.setCellStyle(moneyStyle);

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out);

            String filename = "don_hang_" + LocalDateTime.now().format(FILE_FMT) + ".xlsx";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(out.toByteArray());
        }
    }

    /** GET /api/admin/export/inventory */
    @GetMapping("/inventory")
    public ResponseEntity<byte[]> exportInventory() throws Exception {
        List<Product> products = productRepository.findAll();

        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Tồn kho");

            // Header
            CellStyle headerStyle = wb.createCellStyle();
            Font hf = wb.createFont(); hf.setBold(true); hf.setFontHeightInPoints((short) 11);
            headerStyle.setFont(hf);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font wf = wb.createFont(); wf.setColor(IndexedColors.WHITE.getIndex()); wf.setBold(true);
            headerStyle.setFont(wf);

            String[] headers = {"#", "Sản phẩm", "Danh mục", "Giá", "Tồn kho", "Trạng thái"};
            Row hr = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell c = hr.createCell(i);
                c.setCellValue(headers[i]);
                c.setCellStyle(headerStyle);
            }

            // Low-stock style
            CellStyle lowStyle = wb.createCellStyle();
            Font lf = wb.createFont(); lf.setColor(IndexedColors.RED.getIndex()); lf.setBold(true);
            lowStyle.setFont(lf);

            int rowNum = 1;
            for (int i = 0; i < products.size(); i++) {
                Product p = products.get(i);
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(p.getName());
                row.createCell(2).setCellValue(p.getCategory() != null ? p.getCategory().getName() : "");
                row.createCell(3).setCellValue(p.getPrice().doubleValue());
                Cell stockCell = row.createCell(4);
                stockCell.setCellValue(p.getStock());
                boolean lowStock = p.getStock() != null && p.getStock() <= 5;
                if (lowStock) stockCell.setCellStyle(lowStyle);
                row.createCell(5).setCellValue(lowStock ? "⚠ Sắp hết" : "Còn hàng");
            }

            for (int i = 0; i < headers.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ton_kho.xlsx\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(out.toByteArray());
        }
    }
}
