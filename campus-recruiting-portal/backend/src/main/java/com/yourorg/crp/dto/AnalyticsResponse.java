package com.yourorg.crp.dto;

import java.math.BigDecimal;
import java.util.List;

public record AnalyticsResponse(
		long companies,
		long students,
		long postings,
		long pendingPostings,
		long approvedPostings,
		long rejectedPostings,
		long closedPostings,
		long applications,
		long placedStudents,
		BigDecimal placementRate,
		List<CompanyApplicationStats> applicationsPerCompany,
		List<BranchPlacementStats> branchPlacementStats,
		List<CgpaBandPlacementStats> cgpaBandPlacementStats) {
}
