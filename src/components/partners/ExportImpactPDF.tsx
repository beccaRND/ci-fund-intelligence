'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  BrandPartner,
  ProjectAttribution,
  aggregatePartnerMetrics,
} from '@/lib/seed/brandPartners';
import { projects } from '@/lib/seed/projects';

interface Props {
  partner: BrandPartner;
  attributions: ProjectAttribution[];
}

export default function ExportImpactPDF({ partner, attributions }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      // Dynamically import to avoid SSR issues with @react-pdf/renderer
      const { pdf, Document, Page, Text, View, StyleSheet, Font } = await import('@react-pdf/renderer');

      const metrics = aggregatePartnerMetrics(partner.id);

      const styles = StyleSheet.create({
        page: {
          fontFamily: 'Helvetica',
          backgroundColor: '#FFFFFF',
          padding: 48,
          fontSize: 10,
          color: '#2C2C2C',
        },
        header: {
          marginBottom: 28,
          paddingBottom: 16,
          borderBottomWidth: 2,
          borderBottomColor: '#00A86B',
          borderBottomStyle: 'solid',
        },
        logoRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        logoBox: {
          width: 28,
          height: 28,
          backgroundColor: '#00A86B',
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        },
        logoText: {
          color: '#FFFFFF',
          fontSize: 13,
          fontFamily: 'Helvetica-Bold',
        },
        fundName: {
          fontSize: 11,
          fontFamily: 'Helvetica-Bold',
          color: '#2C2C2C',
        },
        fundSub: {
          fontSize: 8,
          color: '#888888',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        reportTitle: {
          fontSize: 22,
          fontFamily: 'Helvetica-Bold',
          color: '#00A86B',
          marginBottom: 4,
        },
        reportSubtitle: {
          fontSize: 11,
          color: '#555555',
        },
        section: {
          marginBottom: 20,
        },
        sectionTitle: {
          fontSize: 9,
          fontFamily: 'Helvetica-Bold',
          color: '#00A86B',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginBottom: 8,
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderBottomColor: '#E8F5EF',
          borderBottomStyle: 'solid',
        },
        kpiGrid: {
          flexDirection: 'row',
          gap: 10,
          marginBottom: 8,
        },
        kpiBox: {
          flex: 1,
          backgroundColor: '#F7FAF8',
          borderRadius: 4,
          padding: 10,
          borderWidth: 1,
          borderColor: '#E8F5EF',
          borderStyle: 'solid',
        },
        kpiValue: {
          fontSize: 18,
          fontFamily: 'Helvetica-Bold',
          color: '#00A86B',
          marginBottom: 2,
        },
        kpiLabel: {
          fontSize: 8,
          color: '#666666',
        },
        kpiSub: {
          fontSize: 7,
          color: '#999999',
          marginTop: 2,
        },
        projectRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
          borderBottomStyle: 'solid',
        },
        projectName: {
          fontSize: 10,
          fontFamily: 'Helvetica-Bold',
          color: '#2C2C2C',
          marginBottom: 2,
        },
        projectMeta: {
          fontSize: 8,
          color: '#666666',
          marginBottom: 2,
        },
        projectNotes: {
          fontSize: 7.5,
          color: '#888888',
          maxWidth: '65%',
        },
        projectMetrics: {
          alignItems: 'flex-end',
          minWidth: 80,
        },
        projectHa: {
          fontSize: 11,
          fontFamily: 'Helvetica-Bold',
          color: '#00A86B',
        },
        projectHaLabel: {
          fontSize: 7,
          color: '#888888',
        },
        badge: {
          backgroundColor: '#E8F5EF',
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 2,
          marginTop: 3,
        },
        badgeText: {
          fontSize: 7,
          color: '#007A4D',
          fontFamily: 'Helvetica-Bold',
        },
        integrityBox: {
          backgroundColor: '#F7FAF8',
          borderRadius: 4,
          padding: 12,
          borderLeftWidth: 3,
          borderLeftColor: '#00A86B',
          borderLeftStyle: 'solid',
        },
        integrityText: {
          fontSize: 8.5,
          color: '#444444',
          lineHeight: 1.5,
        },
        footer: {
          position: 'absolute',
          bottom: 30,
          left: 48,
          right: 48,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: '#E8F5EF',
          borderTopStyle: 'solid',
          paddingTop: 8,
        },
        footerText: {
          fontSize: 7,
          color: '#AAAAAA',
        },
        footerGreen: {
          fontSize: 7,
          color: '#00A86B',
          fontFamily: 'Helvetica-Bold',
        },
      });

      // Enrich attribution data
      const enriched = attributions.map((attr) => {
        const project = projects.find((p) => p.id === attr.projectId);
        return { attr, project };
      });

      const generatedDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const Doc = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoRow}>
                <View style={styles.logoBox}>
                  <Text style={styles.logoText}>CI</Text>
                </View>
                <View>
                  <Text style={styles.fundName}>CI Regenerative Fund for Nature</Text>
                  <Text style={styles.fundSub}>Impact Intelligence Platform</Text>
                </View>
              </View>
              <Text style={styles.reportTitle}>{partner.name} Impact Report</Text>
              <Text style={styles.reportSubtitle}>
                {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)} Partner · Portfolio attribution summary · Generated {generatedDate}
              </Text>
            </View>

            {/* KPI tiles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Portfolio Impact Summary</Text>
              <View style={styles.kpiGrid}>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiValue}>{metrics.totalHectares.toLocaleString()}</Text>
                  <Text style={styles.kpiLabel}>Hectares Attributed</Text>
                  <Text style={styles.kpiSub}>{metrics.directHectares.toLocaleString()} direct · {metrics.portfolioHectares.toLocaleString()} portfolio</Text>
                </View>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiValue}>{metrics.totalBeneficiaries.toLocaleString()}</Text>
                  <Text style={styles.kpiLabel}>Farmer Beneficiaries</Text>
                  <Text style={styles.kpiSub}>Across {metrics.totalProjects} active projects</Text>
                </View>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiValue}>{metrics.totalProjects}</Text>
                  <Text style={styles.kpiLabel}>Projects in Portfolio</Text>
                  <Text style={styles.kpiSub}>{metrics.commodities.join(', ')}</Text>
                </View>
              </View>
            </View>

            {/* Project breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attributed Projects</Text>
              {enriched.map(({ attr, project }) => {
                if (!project) return null;
                return (
                  <View key={attr.projectId} style={styles.projectRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={styles.projectMeta}>{project.country} · {project.region} · Since {attr.startYear}</Text>
                      {attr.notes && <Text style={styles.projectNotes}>{attr.notes}</Text>}
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{attr.attributionType === 'direct' ? 'Direct' : 'Portfolio'} · {attr.commodityFocus.join(', ')}</Text>
                      </View>
                    </View>
                    <View style={styles.projectMetrics}>
                      <Text style={styles.projectHa}>{attr.hectares.toLocaleString()}</Text>
                      <Text style={styles.projectHaLabel}>hectares</Text>
                      {attr.beneficiaries > 0 && (
                        <>
                          <Text style={[styles.projectHa, { fontSize: 9, marginTop: 4 }]}>{attr.beneficiaries.toLocaleString()}</Text>
                          <Text style={styles.projectHaLabel}>farmers</Text>
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Data integrity note */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Integrity</Text>
              <View style={styles.integrityBox}>
                <Text style={styles.integrityText}>
                  All impact data in this report is sourced from CI Regenerative Fund for Nature annual reporting data, grantee monitoring and evaluation submissions, and verified against published CI Annual Reports (2022, 2023, 2024). Hectare and beneficiary figures reflect attributed shares of project-level outcomes — direct attribution indicates {partner.name} as primary funder of that project; portfolio attribution reflects shared access across multiple brand partners. All data is subject to independent verification by Conservation International.
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <Text style={styles.footerText}>CI Regenerative Fund for Nature · Fund Intelligence Platform</Text>
              <Text style={styles.footerText}>Generated {generatedDate} · Confidential</Text>
              <Text style={styles.footerGreen}>conservation.org</Text>
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(<Doc />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CI-Fund-${partner.name.replace(/\s+/g, '-')}-Impact-Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors disabled:opacity-60"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      <Download size={16} />
      {loading ? 'Generating PDF…' : 'Export Impact Report'}
    </button>
  );
}
