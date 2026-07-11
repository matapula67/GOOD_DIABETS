import jsPDF from 'jspdf';
import { AssessmentRecord, User } from '../types';

function genderLabel(g: string) {
  return g === 'male' ? 'Mwanaume' : 'Mwanamke';
}
function yesNo(v: boolean) {
  return v ? 'Ndiyo' : 'Hapana';
}
function activityLabel(a: string) {
  return { none: 'Hakuna', low: 'Chini', moderate: 'Wastani', high: 'Nyingi' }[a] || a;
}
function riskLabel(level: string) {
  return { low: 'HATARI NDOGO', medium: 'HATARI YA WASTANI', high: 'HATARI KUBWA' }[level] || level;
}
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('sw-TZ', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
}

/** Builds a flat, ordered list of [label, value] rows shared by CSV, PDF, and the
 * doctor-request preview, so every export stays in sync with a single source of truth. */
export function buildReportRows(user: User, record: AssessmentRecord): { section: string; rows: [string, string][] }[] {
  const { input, result } = record;
  return [
    {
      section: 'Taarifa za Usajili',
      rows: [
        ['Jina Kamili', user.name],
        ['Barua Pepe', user.email],
        ['Simu', user.phone],
        ['Jinsia (Usajili)', genderLabel(user.gender)],
        ['Umri (Usajili)', String(user.age)],
      ],
    },
    {
      section: 'Taarifa za Tathmini',
      rows: [
        ['Tarehe ya Tathmini', formatDate(record.date)],
        ['Umri', String(input.age)],
        ['Jinsia', genderLabel(input.gender)],
        ['BMI', String(input.bmi)],
        ['Sukari ya Damu (mg/dL)', String(input.glucose)],
        ['Shinikizo la Damu (mmHg)', String(input.bloodPressure)],
        ['Cholesterol (mg/dL)', String(input.cholesterol)],
        ['Historia ya Ugonjwa wa Moyo', yesNo(input.heartDisease)],
        ['Hypertension', yesNo(input.hypertension)],
        ['Uvutaji Sigara', yesNo(input.smoking)],
        ['Matumizi ya Pombe', yesNo(input.alcohol)],
        ['Shughuli za Mwili', activityLabel(input.activity)],
        ['Muda wa Kulala (saa/usiku)', String(input.sleepHours)],
      ],
    },
    {
      section: 'Matokeo ya Modeli',
      rows: [
        ['Kiwango cha Hatari', riskLabel(result.level)],
        ['Asilimia ya Uhakika', result.confidence + '%'],
        ['Alama', `${result.score} / ${result.maxScore}`],
        ['Sababu Kuu Zilizoongeza Hatari', result.factors.length ? result.factors.join('; ') : 'Hakuna sababu kubwa'],
      ],
    },
  ];
}

export function downloadAssessmentCSV(user: User, record: AssessmentRecord) {
  const sections = buildReportRows(user, record);
  const lines: string[] = [];
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

  lines.push(esc('AfyaTathmini — Ripoti ya Tathmini ya Hatari ya Kisukari'));
  lines.push('');
  sections.forEach((sec) => {
    lines.push(esc(sec.section));
    lines.push([esc('Kipengele'), esc('Thamani')].join(','));
    sec.rows.forEach(([k, v]) => lines.push([esc(k), esc(v)].join(',')));
    lines.push('');
  });
  lines.push(esc('Mapendekezo ya Kiafya'));
  record.result.recommendations.forEach((r, i) => lines.push(esc(`${i + 1}. ${r}`)));

  const csv = '\uFEFF' + lines.join('\r\n'); // BOM for correct UTF-8 (Kiswahili) rendering in Excel
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `tathmini-${record.id}.csv`);
}

export function downloadAssessmentPDF(user: User, record: AssessmentRecord) {
  const sections = buildReportRows(user, record);
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  let y = 56;

  const riskColors: Record<string, [number, number, number]> = {
    low: [22, 163, 74],
    medium: [217, 119, 6],
    high: [220, 38, 38],
  };
  const color = riskColors[record.result.level] || [30, 41, 59];

  // Header
  doc.setFillColor(16, 105, 168);
  doc.rect(0, 0, pageWidth, 74, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AfyaTathmini', marginX, 34);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Ripoti ya Tathmini ya Hatari ya Kisukari', marginX, 54);
  y = 100;

  // Risk badge
  doc.setFillColor(color[0], color[1], color[2]);
  const badgeText = `${record.result.level.toUpperCase()} RISK — ${record.result.confidence}% UHAKIKA`;
  const badgeWidth = doc.getTextWidth(badgeText) + 28;
  doc.roundedRect(marginX, y, badgeWidth, 26, 6, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(badgeText, marginX + 14, y + 17);
  doc.setTextColor(30, 41, 59);
  y += 46;

  const writeSection = (title: string, rows: [string, string][]) => {
    if (y > 740) { doc.addPage(); y = 56; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(16, 105, 168);
    doc.text(title, marginX, y);
    y += 8;
    doc.setDrawColor(214, 224, 235);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    rows.forEach(([k, v]) => {
      if (y > 770) { doc.addPage(); y = 56; }
      doc.setFont('helvetica', 'bold');
      doc.text(`${k}:`, marginX, y);
      doc.setFont('helvetica', 'normal');
      const wrapped = doc.splitTextToSize(v, pageWidth - marginX * 2 - 190);
      doc.text(wrapped, marginX + 190, y);
      y += 16 * Math.max(1, wrapped.length);
    });
    y += 14;
  };

  sections.forEach((sec) => writeSection(sec.section, sec.rows));

  if (y > 700) { doc.addPage(); y = 56; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(16, 105, 168);
  doc.text('Mapendekezo ya Kiafya', marginX, y);
  y += 8;
  doc.setDrawColor(214, 224, 235);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  record.result.recommendations.forEach((r, i) => {
    if (y > 770) { doc.addPage(); y = 56; }
    const wrapped = doc.splitTextToSize(`${i + 1}. ${r}`, pageWidth - marginX * 2);
    doc.text(wrapped, marginX, y);
    y += 15 * wrapped.length;
  });

  y += 20;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(120, 132, 148);
  doc.text('Taarifa hii si mbadala wa ushauri wa kitaalamu wa kimatibabu. Tafadhali onana na daktari.', marginX, Math.min(y, 800));

  doc.save(`tathmini-${record.id}.pdf`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
