from PIL import Image, ImageDraw, ImageFont
import os

width, height = 1200, 675
img = Image.new('RGB', (width, height), color=(11, 14, 20))
draw = ImageDraw.Draw(img)

# Background gradient
for y in range(height):
    r = int(11 + (22 - 11) * (y / height))
    g = int(14 + (28 - 14) * (y / height))
    b = int(20 + (40 - 20) * (y / height))
    draw.line([(0, y), (width, y)], fill=(r, g, b))

# Outer borders
draw.rectangle([(8, 8), (width - 9, height - 9)], outline=(212, 175, 55, 200), width=2)
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
logo_path = '/Users/ezesoft-mac-3/Developer/nexus-tactics/public/logo_gg.png'
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    logo.thumbnail((90, 90))
    img.paste(logo, (35, 22), mask=logo)

draw.text((140, 28), 'GABLE GUARDIANS ($GABLE)', fill=(245, 158, 11), font=font_title)
draw.text((140, 68), 'Solana 2D Pixel MMORPG Architecture · Tokenomics & Mycelium Strategy Deep Dive', fill=(148, 163, 184), font=font_subtitle)

# Top Right Badge
draw.rectangle([(980, 32), (1165, 68)], fill=(30, 58, 138), outline=(59, 130, 246), width=1)
draw.text((995, 42), 'SOLANA METAPLEX CORE', fill=(147, 197, 253), font=font_mono)

# Columns Setup
card_y = 118
card_h = 480
card_w = 360
gap = 25
start_x = 35

columns = [
    {
        'title': '1. ON-CHAIN TECH STACK',
        'color': (6, 182, 212),
        'bg_badge': (8, 51, 68),
        'items': [
            ('Solana Program Engine', 'Coordinates state: 5noZYmNbF...amHzTqA'),
            ('MagicBlock Ephemeral Rollups', 'Sub-second zero-gas response for PvP & dungeons.'),
            ('MagicBlock VRF Randomness', 'Tamper-proof VRF for combat drops & forging.'),
            ('Metaplex Bubblegum (cNFTs)', 'Ultra low-cost compressed NFTs for gear & skills.'),
            ('Metaplex Core (1:1 NFTs)', 'Awakened Altar Gargoyles stored on-chain.'),
            ('True Player Ownership', 'Characters & items stay in user wallet, not servers.')
        ]
    },
    {
        'title': '2. $GABLE TOKENOMICS',
        'color': (245, 158, 11),
        'bg_badge': (69, 26, 3),
        'items': [
            ('Solana Token Mint (CA)', '9uTekAxmx4rqBcR3iGkKmaBwVWMmi7TXEU41frBdBAGS'),
            ('Fixed Maximum Supply', '1,000,000,000 $GABLE (1B tokens minted).'),
            ('SOL-Pegged Dynamic Pricing', 'Costs pegged to SOL via Titan Exchange feed.'),
            ('In-Game Burn / Sinks', 'Homestead farming, tool repairs, dragon dungeon.'),
            ('PvP GABLE Mining Cave', 'Multi-tier pickaxes; refine mined crystal fragments.'),
            ('Multi-Token Rewards', 'Earn $PLAY, $SKR, $SOL and RWA Gold (XAUt0).')
        ]
    },
    {
        'title': '3. STRATEGY & METRICS',
        'color': (168, 85, 247),
        'bg_badge': (59, 7, 100),
        'items': [
            ('Mycelium Finance Allocation', '~$3,640 USD routed liquidity (10.8% of portfolio).'),
            ('Meteora Liquidity Pool', '~$14,729 USD in pool (Pair: 9qfdrg...HBim).'),
            ('Cross-Platform Reach', 'Web Browser, Solana Seeker & PlaySolana PSG1.'),
            ('Active Content Roadmap', 'Halloween Samhain Pact live; Level 100 -> 1000.'),
            ('Promising Catalyst', 'Seamless mobile Web3 hardware integration.'),
            ('Key Risk / Question', 'DEX pool depth requires sustainable player volume.')
        ]
    }
]

for i, col in enumerate(columns):
    cx = start_x + i * (card_w + gap)
    draw.rectangle([(cx, card_y), (cx + card_w, card_y + card_h)], fill=(17, 24, 39), outline=(55, 65, 81), width=1)
    # Header bar
    draw.rectangle([(cx, card_y), (cx + card_w, card_y + 44)], fill=col['bg_badge'])
    draw.line([(cx, card_y + 44), (cx + card_w, card_y + 44)], fill=col['color'], width=2)
    draw.text((cx + 15, card_y + 13), col['title'], fill=col['color'], font=font_heading)

    # Items
    iy = card_y + 58
    for label, desc in col['items']:
        draw.text((cx + 15, iy), f'• {label}:', fill=(243, 244, 246), font=font_bold)
        
        # Format CA cleanly
        if '9uTek' in desc:
            draw.text((cx + 15, iy + 18), '9uTekAxmx4rqBcR3iGkKma...', fill=(147, 197, 253), font=font_mono)
            draw.text((cx + 15, iy + 33), '...BwVWMmi7TXEU41frBdBAGS', fill=(147, 197, 253), font=font_mono)
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
draw.text((800, 627), 'gableguardians.xyz · myceliumfinance.com', fill=(212, 175, 55), font=font_footer)

output_path = '/Users/ezesoft-mac-3/Developer/nexus-tactics/public/gable_infographic.png'
img.save(output_path, quality=95)
print('Infographic regenerated successfully at:', output_path)
