from PIL import Image, ImageDraw, ImageFont
import os

width, height = 1200, 675
img = Image.new('RGB', (width, height), color=(10, 15, 24))
draw = ImageDraw.Draw(img)

# Background gradient
for y in range(height):
    r = int(10 + (20 - 10) * (y / height))
    g = int(15 + (30 - 15) * (y / height))
    b = int(24 + (42 - 24) * (y / height))
    draw.line([(0, y), (width, y)], fill=(r, g, b))

# Borders
draw.rectangle([(8, 8), (width - 9, height - 9)], outline=(110, 127, 74), width=2)
draw.rectangle([(12, 12), (width - 13, height - 13)], outline=(30, 41, 59), width=1)

# Fonts
font_title = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 28)
font_subtitle = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 15)
font_heading = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 17)
font_body = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 13)
font_bold = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 13)
font_mono = ImageFont.truetype('/System/Library/Fonts/Courier New Bold.ttf', 11)
font_footer = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 13)

# Header
logo_path = '/Users/ezesoft-mac-3/Developer/nexus-tactics/public/knots_mark.png'
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    logo.thumbnail((90, 90))
    img.paste(logo, (35, 22), mask=logo)

draw.text((140, 28), 'KNOTS ON STONK ($KNOTS)', fill=(190, 225, 115), font=font_title)
draw.text((140, 68), 'Reflexive Solana Tokenomics, Yield Mechanics & Mycelium Strategy Liquidity Analysis', fill=(148, 163, 184), font=font_subtitle)

# Top Right Badge
draw.rectangle([(970, 32), (1165, 68)], fill=(38, 55, 30), outline=(110, 155, 60), width=1)
draw.text((985, 42), 'SOLANA · STONKFUN LAUNCH', fill=(190, 230, 120), font=font_mono)

# Columns Setup
card_y = 118
card_h = 480
card_w = 360
gap = 25
start_x = 35

columns = [
    {
        'title': '1. REFLEXIVE TOKENOMICS',
        'color': (190, 225, 115),
        'bg_badge': (25, 42, 20),
        'items': [
            ('Solana Token Mint (CA)', '8RVBk8vxLiUHueLUW1f4izFVqN3nWippLhkohKg6EGkS'),
            ('Fixed Maximum Supply', '1,000,000,000 $KNOTS (1 Billion total minted).'),
            ('3% Transfer Tax', 'Assessed on all transactions across DEX venues.'),
            ('$STONK Dividend Payouts', 'Tax pooled and paid out pro-rata to holders in $STONK.'),
            ('Minimum Payout Balance', 'Requires holding at least $20 in $KNOTS to earn.'),
            ('Distribution Fee (~2.5%)', 'Covers network gas costs and operational routing.')
        ]
    },
    {
        'title': '2. PRODUCT & ARCHITECTURE',
        'color': (56, 189, 248),
        'bg_badge': (12, 45, 72),
        'items': [
            ('The Mirror Concept', 'STONK spelled backward is KNOTS (paired with reverse).'),
            ('Launchpad Origin', 'Launched via StonkFun on Solana; trades on Raydium.'),
            ('Core Liquidity Pools', 'Raydium KNOTS/STONK ($268k+ LP), Meteora KNOTS/SOL.'),
            ('Live Mini-Game', 'Reverse Jump arcade platformer playable in-browser.'),
            ('Trading Competitions', 'Active community trading cups with 50k $STONK prizes.'),
            ('Corporate Entity', 'KNOTS ON STONK LLC (Registered in Wyoming, USA).')
        ]
    },
    {
        'title': '3. MYCELIUM STRATEGY & RISK',
        'color': (244, 114, 182),
        'bg_badge': (60, 20, 45),
        'items': [
            ('#1 Mycelium Allocation', '$6,665.67 USD routed (20.27% of portfolio share).'),
            ('Dual Raydium Strategy Pools', 'ESF/KNOTS ($3,739) & MYC/KNOTS ($2,925) active.'),
            ('Promising Catalyst', 'Automated passive yield in $STONK from DEX trading.'),
            ('Key Structural Risk', 'Transfer taxes can hinder routing on DEX aggregators.'),
            ('Observation Date', 'October 17, 2026 on-chain verified telemetry.'),
            ('Ecosystem Availability', 'Accessible on Jupiter, Raydium, and Meteora.')
        ]
    }
]

for i, col in enumerate(columns):
    cx = start_x + i * (card_w + gap)
    draw.rectangle([(cx, card_y), (cx + card_w, card_y + card_h)], fill=(17, 24, 39), outline=(55, 65, 81), width=1)
    draw.rectangle([(cx, card_y), (cx + card_w, card_y + 44)], fill=col['bg_badge'])
    draw.line([(cx, card_y + 44), (cx + card_w, card_y + 44)], fill=col['color'], width=2)
    draw.text((cx + 15, card_y + 13), col['title'], fill=col['color'], font=font_heading)

    iy = card_y + 58
    for label, desc in col['items']:
        draw.text((cx + 15, iy), f'• {label}:', fill=(243, 244, 246), font=font_bold)
        if '8RVBk8' in desc:
            draw.text((cx + 15, iy + 18), '8RVBk8vxLiUHueLUW1f4izFV...', fill=(147, 197, 253), font=font_mono)
            draw.text((cx + 15, iy + 33), '...qN3nWippLhkohKg6EGkS', fill=(147, 197, 253), font=font_mono)
            iy += 72
        elif len(desc) > 42:
            idx = desc.rfind(' ', 0, 42)
            if idx == -1: idx = 40
            part1 = desc[:idx]
            part2 = desc[idx:].strip()
            draw.text((cx + 15, iy + 18), part1, fill=(156, 163, 175), font=font_body)
            draw.text((cx + 15, iy + 34), part2, fill=(156, 163, 175), font=font_body)
            iy += 72
        else:
            draw.text((cx + 15, iy + 18), desc, fill=(156, 163, 175), font=font_body)
            iy += 68

# Footer
draw.rectangle([(35, 615), (1165, 652)], fill=(15, 23, 42), outline=(30, 41, 59), width=1)
draw.text((50, 627), 'Research & Visual Analysis for Mycelium Finance TaskMarket Bounty · Created by AI Agent', fill=(100, 116, 139), font=font_footer)
draw.text((810, 627), 'knotsonstonk.com · myceliumfinance.com', fill=(190, 225, 115), font=font_footer)

output_path = '/Users/ezesoft-mac-3/Developer/nexus-tactics/public/knots_infographic.png'
img.save(output_path, quality=95)
print('Infographic saved successfully at:', output_path)
