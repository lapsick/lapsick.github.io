"""Generate public/resume.pdf from the profile data displayed on About.

Run with Python with reportlab installed; Node >=22.12 is also required.
"""
import json
from pathlib import Path
import subprocess
from html import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak

ROOT = Path(__file__).resolve().parents[1]
profile = json.loads(subprocess.check_output(
    ['node', '--experimental-strip-types', '--input-type=module', '-e',
     "import { profile } from './src/data/profile.ts'; console.log(JSON.stringify(profile));"],
    cwd=ROOT, encoding='utf-8',
))

FONT_DIR = Path('C:/Windows/Fonts')
pdfmetrics.registerFont(TTFont('Resume', str(FONT_DIR / 'arial.ttf')))
pdfmetrics.registerFont(TTFont('ResumeBold', str(FONT_DIR / 'arialbd.ttf')))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='ResumeBold')
INK = colors.HexColor('#17212f')
BLUE = colors.HexColor('#1d4ed8')
MUTED = colors.HexColor('#526074')


def clean(text):
    return escape(str(text).replace('—', '-').replace('–', '-').replace('\u2011', '-'))


def style(name, **kwargs):
    defaults = dict(fontName='Resume', fontSize=9.5, leading=12.5,
                    textColor=INK, spaceAfter=6, alignment=TA_LEFT)
    defaults.update(kwargs)
    return ParagraphStyle(name, **defaults)


BODY = style('body')
SMALL = style('small', fontSize=8.5, leading=12, textColor=MUTED)
SECTION = style('section', fontName='ResumeBold', fontSize=13, leading=17,
                textColor=BLUE, spaceBefore=12, spaceAfter=8, keepWithNext=True)
ROLE = style('role', fontName='ResumeBold', fontSize=10.5, leading=14,
             spaceBefore=6, spaceAfter=3, keepWithNext=True)
META = style('meta', fontSize=8.5, leading=12, textColor=MUTED,
             spaceAfter=5, keepWithNext=True)
BULLET = style('bullet', leftIndent=10, firstLineIndent=-8, spaceAfter=3)


def para(text, paragraph_style=BODY):
    return Paragraph(clean(text), paragraph_style)


def section(title):
    story.append(para(title, SECTION))


def date(value):
    if value == 'present':
        return 'Present'
    from datetime import datetime
    return datetime.strptime(value, '%Y-%m').strftime('%b %Y') if '-' in value else value


def footer(canvas, doc):
    canvas.setStrokeColor(colors.HexColor('#dce2ea'))
    canvas.line(42, 37, A4[0] - 42, 37)
    canvas.setFont('Resume', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 24, profile['name'] + ' | Resume')
    canvas.drawRightString(A4[0] - 42, 24, str(doc.page))


story = []
story.append(para(profile['name'], style('name', fontName='ResumeBold', fontSize=25,
                                       leading=30, spaceAfter=5)))
story.append(para(profile['title'], style('title', fontSize=12, leading=17,
                                        textColor=BLUE, spaceAfter=9)))
story.append(para(profile['location'], SMALL))
story.append(Paragraph(
    f'<link href="mailto:{escape(profile["email"])}" color="#1d4ed8">{clean(profile["email"])}</link>'
    f' | <link href="{escape(profile["linkedinUrl"])}" color="#1d4ed8">LinkedIn</link>'
    f' | <link href="{escape(profile["githubUrl"])}" color="#1d4ed8">GitHub</link>', SMALL))

section('Summary')
story.append(Paragraph(f'{clean(profile["about"])} <b>{clean(profile["careerObjective"])}</b>', BODY))
section('Focus areas')
for area in profile['focusAreas']:
    story.append(Paragraph(f'<b>{clean(area["title"])}</b> - {clean(area["description"])}', BODY))
section('Skills')
story.append(para(' · '.join(profile['skills'])))

story.append(PageBreak())
section('Experience')
for entry in profile['experience']:
    story.append(para(entry['role'], ROLE))
    meta = ' | '.join(filter(None, [entry['company'], entry.get('location'),
                                  f'{date(entry["startDate"])} - {date(entry["endDate"])}']))
    story.append(para(meta, META))
    for highlight in entry['highlights']:
        story.append(para('• ' + highlight, BULLET))
    if entry.get('technologies'):
        story.append(para(' · '.join(entry['technologies']), SMALL))

story.append(PageBreak())
section('Technical skills')
for category in profile['skillCategories']:
    story.append(Paragraph(f'<b>{clean(category["name"])}</b><br/>'
                           f'{clean(" · ".join(category["skills"]))}', BODY))

section('Education')
for edu in profile['education']:
    story.append(para(f'{edu["qualification"]} - {edu["institution"]} ({edu["endDate"]})'))
section('Languages')
story.append(para(' · '.join(f'{x["name"]} - {x["level"]}' for x in profile['languages'])))

output = ROOT / 'public/resume.pdf'
doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=42, leftMargin=42,
                        topMargin=38, bottomMargin=50,
                        title=f'{profile["name"]} - Resume', author=profile['name'])
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(output)
