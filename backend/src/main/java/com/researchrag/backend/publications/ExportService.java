package com.researchrag.backend.publications;

import com.researchrag.backend.publications.Faculty;
import com.researchrag.backend.publications.Publication;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExportService {

    public ByteArrayInputStream generateExcelReport(Faculty faculty) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Profile Sheet
            Sheet profileSheet = workbook.createSheet("Profile");
            profileSheet.createRow(0).createCell(0).setCellValue("Name");
            profileSheet.getRow(0).createCell(1).setCellValue(faculty.getName());
            profileSheet.createRow(1).createCell(0).setCellValue("Affiliations");
            profileSheet.getRow(1).createCell(1).setCellValue(faculty.getAffiliations());
            profileSheet.createRow(2).createCell(0).setCellValue("Interests");
            profileSheet.getRow(2).createCell(1).setCellValue(String.join(", ", faculty.getInterests()));
            profileSheet.createRow(3).createCell(0).setCellValue("Summary");
            profileSheet.getRow(3).createCell(1).setCellValue(faculty.getSummary());

            // Publications Sheet
            Sheet publicationsSheet = workbook.createSheet("Publications");
            String[] headers = {"Title", "Authors", "Year", "Citations", "Publication Source", "Link"};
            Row headerRow = publicationsSheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Publication pub : faculty.getPublications()) {
                Row row = publicationsSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(pub.getTitle());
                row.createCell(1).setCellValue(pub.getAuthors());
                row.createCell(2).setCellValue(pub.getYear());
                row.createCell(3).setCellValue(pub.getCitations());
                row.createCell(4).setCellValue(pub.getPublicationSource());
                row.createCell(5).setCellValue(pub.getLink());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream generateWordReport(Faculty faculty) throws IOException {
        try (XWPFDocument document = new XWPFDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            XWPFRun titleRun = document.createParagraph().createRun();
            titleRun.setText("Research Profile: " + faculty.getName());
            titleRun.setBold(true);

            document.createParagraph().createRun().setText("Affiliations: " + faculty.getAffiliations());
            document.createParagraph().createRun().setText("Interests: " + String.join(", ", faculty.getInterests()));

            XWPFRun summaryTitleRun = document.createParagraph().createRun();
            summaryTitleRun.setText("Research Summary");
            summaryTitleRun.setBold(true);

            document.createParagraph().createRun().setText(faculty.getSummary());

            XWPFRun pubTitleRun = document.createParagraph().createRun();
            pubTitleRun.setText("Publications");
            pubTitleRun.setBold(true);

            XWPFTable table = document.createTable();
            XWPFTableRow header = table.getRow(0);
            header.getCell(0).setText("Title");
            header.addNewTableCell().setText("Authors");
            header.addNewTableCell().setText("Year");
            header.addNewTableCell().setText("Citations");

            for (Publication pub : faculty.getPublications()) {
                XWPFTableRow row = table.createRow();
                row.getCell(0).setText(pub.getTitle());
                row.getCell(1).setText(pub.getAuthors());
                row.getCell(2).setText(String.valueOf(pub.getYear()));
                row.getCell(3).setText(String.valueOf(pub.getCitations()));
            }

            document.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
