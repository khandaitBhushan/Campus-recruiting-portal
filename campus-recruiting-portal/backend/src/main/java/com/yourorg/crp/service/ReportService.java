package com.yourorg.crp.service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.yourorg.crp.dto.AnalyticsResponse;

@Service
public class ReportService {
	private final AnalyticsService analyticsService;

	public ReportService(AnalyticsService analyticsService) {
		this.analyticsService = analyticsService;
	}

	public ByteArrayInputStream generatePlacementReport() {
		AnalyticsResponse stats = analyticsService.snapshot();
		Document document = new Document();
		ByteArrayOutputStream out = new ByteArrayOutputStream();

		try {
			PdfWriter.getInstance(document, out);
			document.open();

			Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
			Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.BLUE);
			Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
			Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

			Paragraph title = new Paragraph("University Placement Cell - CRM Placement Report", titleFont);
			title.setAlignment(Element.ALIGN_CENTER);
			title.setSpacingAfter(20);
			document.add(title);

			Paragraph summaryHeader = new Paragraph("Key Placement Metrics", sectionFont);
			summaryHeader.setSpacingAfter(10);
			document.add(summaryHeader);

			PdfPTable summaryTable = new PdfPTable(2);
			summaryTable.setWidthPercentage(100);
			summaryTable.setSpacingAfter(20);

			addCell(summaryTable, "Total Registered Students", boldFont);
			addCell(summaryTable, String.valueOf(stats.students()), normalFont);
			
			addCell(summaryTable, "Students Placed", boldFont);
			addCell(summaryTable, String.valueOf(stats.placedStudents()), normalFont);
			
			addCell(summaryTable, "Placement Rate", boldFont);
			addCell(summaryTable, stats.placementRate() + "%", normalFont);

			addCell(summaryTable, "Total Job Postings", boldFont);
			addCell(summaryTable, String.valueOf(stats.postings()), normalFont);

			addCell(summaryTable, "Active Companies", boldFont);
			addCell(summaryTable, String.valueOf(stats.companies()), normalFont);

			document.add(summaryTable);

			Paragraph branchHeader = new Paragraph("Branch-wise Placement Statistics", sectionFont);
			branchHeader.setSpacingAfter(10);
			document.add(branchHeader);

			PdfPTable branchTable = new PdfPTable(3);
			branchTable.setWidthPercentage(100);
			branchTable.setSpacingAfter(20);
			addCell(branchTable, "Branch Name", boldFont);
			addCell(branchTable, "Total Students", boldFont);
			addCell(branchTable, "Placed Students", boldFont);

			stats.branchPlacementStats().forEach(stat -> {
				addCell(branchTable, stat.branch(), normalFont);
				addCell(branchTable, String.valueOf(stat.students()), normalFont);
				addCell(branchTable, String.valueOf(stat.placed()), normalFont);
			});
			document.add(branchTable);

			Paragraph cgpaHeader = new Paragraph("CGPA Band-wise Placement Statistics", sectionFont);
			cgpaHeader.setSpacingAfter(10);
			document.add(cgpaHeader);

			PdfPTable cgpaTable = new PdfPTable(3);
			cgpaTable.setWidthPercentage(100);
			cgpaTable.setSpacingAfter(20);
			addCell(cgpaTable, "CGPA Band", boldFont);
			addCell(cgpaTable, "Total Students", boldFont);
			addCell(cgpaTable, "Placed Students", boldFont);

			stats.cgpaBandPlacementStats().forEach(stat -> {
				addCell(cgpaTable, stat.band(), normalFont);
				addCell(cgpaTable, String.valueOf(stat.students()), normalFont);
				addCell(cgpaTable, String.valueOf(stat.placed()), normalFont);
			});
			document.add(cgpaTable);

			Paragraph companyHeader = new Paragraph("Company Applications Statistics", sectionFont);
			companyHeader.setSpacingAfter(10);
			document.add(companyHeader);

			PdfPTable companyTable = new PdfPTable(2);
			companyTable.setWidthPercentage(100);
			addCell(companyTable, "Company Name", boldFont);
			addCell(companyTable, "Applications Received", boldFont);

			stats.applicationsPerCompany().forEach(stat -> {
				addCell(companyTable, stat.companyName(), normalFont);
				addCell(companyTable, String.valueOf(stat.applications()), normalFont);
			});
			document.add(companyTable);

			document.close();
		}
		catch (Exception e) {
			throw new RuntimeException("Error building PDF report: " + e.getMessage(), e);
		}

		return new ByteArrayInputStream(out.toByteArray());
	}

	private void addCell(PdfPTable table, String text, Font font) {
		PdfPCell cell = new PdfPCell(new Phrase(text, font));
		cell.setPadding(6);
		cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
		table.addCell(cell);
	}
}
