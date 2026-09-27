import { MarketingMedium, MockupFrame, Product } from '../types';
import drinkCanImg from '../assets/images/sample_drink_can_1790516228168.jpg';
import serumBottleImg from '../assets/images/sample_serum_bottle_1790516240750.jpg';
import coffeeBagImg from '../assets/images/sample_coffee_bag_1790516254007.jpg';

import previewMugImg from '../assets/images/preview_mug_1790516671703.jpg';
import previewBillboardImg from '../assets/images/preview_billboard_1790516686484.jpg';
import previewTshirtImg from '../assets/images/preview_tshirt_1790516698549.jpg';

export const SAMPLE_PRODUCTS: Product[] = [

  {
    id: 'prod_drink',
    name: 'CyberPulse Energy Drink',
    brandName: 'CYBERPULSE',
    tagline: 'Electric Citrus & Botanical Nootropics',
    category: 'Beverage & Wellness',
    imageUrl: drinkCanImg,
    colorPalette: ['#0A0A0A', '#10B981', '#84CC16', '#F8FAFC'],
    description: 'Matte black 330ml sleek beverage can with sharp geometric neon-lime typography and cyber energy motif.',
    isSample: true,
  },
  {
    id: 'prod_serum',
    name: 'Aura Glow Botanical Elixir',
    brandName: 'AURA BOTANICA',
    tagline: 'Cellular Renewal Antioxidant Complex',
    category: 'Clean Luxury Cosmetics',
    imageUrl: serumBottleImg,
    colorPalette: ['#92400E', '#D97706', '#FEF3C7', '#292524'],
    description: 'Heavy amber glass cosmetic dropper bottle with minimalist cream label, gold accents, and organic typography.',
    isSample: true,
  },
  {
    id: 'prod_coffee',
    name: 'Roast & Root Single Origin',
    brandName: 'ROAST & ROOT',
    tagline: 'Ethiopian Heirloom - Washed Honey Process',
    category: 'Specialty Artisan Food',
    imageUrl: coffeeBagImg,
    colorPalette: ['#B45309', '#78350F', '#FEF08A', '#34D399'],
    description: 'Eco-kraft zipper pouch coffee bag featuring bold playful pastel geometric badge design and craft typography.',
    isSample: true,
  },
];

export const MARKETING_MEDIUMS: MarketingMedium[] = [
  {
    id: 'coffee_mug',
    name: 'Ceramic Coffee Mug',
    category: 'essentials',
    iconName: 'Coffee',
    badge: 'Popular Everyday',
    suggestedAspect: '1:1',
    description: 'High-gloss white ceramic mug on a sunny Scandinavian cafe table with subtle steam and warm morning ambiance.',
    defaultPrompt: 'A premium glossy ceramic coffee mug sitting on a sunlit minimalist oak wood cafe table, next to scattered roasted coffee beans and a linen coaster. The product logo and signature graphic identity are seamlessly and crisply printed onto the curved front surface of the mug, complete with natural ceramic glaze reflections, subtle warm steam, and realistic depth of field.',
  },
  {
    id: 'billboard',
    name: 'Metropolitan Billboard',
    category: 'outdoor',
    iconName: 'Maximize2',
    badge: 'High Impact',
    suggestedAspect: '16:9',
    description: 'Giant digital billboard towering above a bustling city center like Times Square at cinematic twilight.',
    defaultPrompt: 'A colossal, high-impact digital advertising billboard towering over a vibrant, bustling metropolitan intersection (like Times Square or Tokyo Shibuya Crossing) during cinematic blue-hour twilight. Blurred yellow cabs and pedestrian silhouettes create dynamic street energy below. The billboard showcases a razor-sharp, epic commercial advertisement featuring the product and its iconic branding with vivid ambient glow and realistic architectural reflections.',
  },
  {
    id: 'tshirt',
    name: 'Heavyweight T-Shirt',
    category: 'apparel',
    iconName: 'Shirt',
    badge: 'Streetwear Merch',
    suggestedAspect: '1:1',
    description: 'Streetwear 280 GSM heavyweight cotton tee with authentic screenprint texture and fabric drape wrinkles.',
    defaultPrompt: 'A luxury 280 GSM heavyweight cotton crewneck t-shirt displayed in a minimalist streetwear studio setting. The product brand logo and graphic identity are screen-printed with precision onto the chest area, showcasing realistic cotton weave texture, natural fabric wrinkles, micro-fibers, and soft studio directional rim lighting.',
  },
  {
    id: 'tote_bag',
    name: 'Canvas Tote Bag',
    category: 'apparel',
    iconName: 'ShoppingBag',
    badge: 'Lifestyle Retail',
    suggestedAspect: '4:3',
    description: 'Eco-friendly organic canvas tote bag carried in an aesthetic gallery or sunlight-filled farmers market.',
    defaultPrompt: 'An aesthetic unbleached natural cotton canvas tote bag carried over the shoulder of a creative professional outside a modern art museum. The brand graphic and typography are printed with authentic screenprint ink into the woven canvas texture, bathed in soft afternoon golden hour light with gentle fabric folds.',
  },
  {
    id: 'packaging_box',
    name: 'Luxury Presentation Box',
    category: 'packaging',
    iconName: 'Box',
    badge: 'Unboxing Experience',
    suggestedAspect: '1:1',
    description: 'Magnetic-close rigid gift box on a stone podium with debossed branding and metallic foil accents.',
    defaultPrompt: 'A luxury rigid magnetic unboxing presentation box resting elegantly on a fluted travertine stone pedestal in a gallery studio. The product brand name and geometric emblems are beautifully embossed with subtle metallic hot-foil stamping on matte textured cardstock, illuminated by warm architectural spotlighting.',
  },
  {
    id: 'smartphone_ad',
    name: 'Mobile Social Feed Ad',
    category: 'digital',
    iconName: 'Smartphone',
    badge: 'Social Media',
    suggestedAspect: '9:16',
    description: 'Flagship smartphone held in hand displaying an engaging Instagram/TikTok sponsored brand launch ad.',
    defaultPrompt: 'A sleek bezel-less titanium flagship smartphone held by a stylish hand in a sunlit loft workspace. The smartphone screen displays a high-converting sponsored Instagram story advertisement celebrating the product with modern graphic typography and a "Shop Now" swipe-up button, featuring realistic OLED glass gloss and soft background blur.',
  },
  {
    id: 'bus_shelter',
    name: 'Urban Transit Shelter',
    category: 'outdoor',
    iconName: 'Store',
    badge: 'Transit Ad',
    suggestedAspect: '3:4',
    description: 'Backlit glass bus stop shelter poster display on a rainy city street at twilight with car light trails.',
    defaultPrompt: 'A backlit urban glass transit shelter advertising poster at dusk along a rain-slicked city boulevard with reflections of amber streetlights and red car tail-lights. The backlit illuminated poster proudly displays the product and brand identity with stunning dynamic contrast and commercial grade poster art.',
  },
  {
    id: 'magazine_spread',
    name: 'Editorial Magazine Spread',
    category: 'retail',
    iconName: 'BookOpen',
    badge: 'Print Editorial',
    suggestedAspect: '16:9',
    description: 'Open luxury lifestyle magazine on a marble surface showing a double-page feature ad spread.',
    defaultPrompt: 'An open, heavy-stock glossy architectural and lifestyle magazine lying gracefully across an Italian Calacatta marble tabletop with an espresso cup nearby. The glossy double-page spread features an elegant, award-winning editorial advertisement showcasing the product with Swiss minimalist typography and studio photography.',
  },
  {
    id: 'storefront_display',
    name: 'Boutique Storefront',
    category: 'retail',
    iconName: 'Building2',
    badge: 'Brick & Mortar',
    suggestedAspect: '16:9',
    description: 'Chic European boutique window display with branded vinyl decals and warm interior retail lighting.',
    defaultPrompt: 'A high-end retail boutique storefront on a charming European street during dusk. The large floor-to-ceiling glass display window features elegant white vinyl branding and decals, with warm interior track lights highlighting a curated wooden display table where the product is prominently featured.',
  },
];

export const INITIAL_MOCKUP_FRAMES: MockupFrame[] = [
  {
    id: 'init_mug_frame',
    productId: 'prod_drink',
    mediumId: 'coffee_mug',
    mediumName: 'Ceramic Coffee Mug',
    imageUrl: previewMugImg,
    promptUsed:
      'A glossy white ceramic coffee mug sitting on a sunlit minimalist oak wood cafe table next to roasted coffee beans and a linen napkin. The CyberPulse matte black and neon lime geometric logo branding is crisply and seamlessly printed onto the curved front of the mug, with realistic ceramic glaze reflections and subtle warm steam rising.',
    aspectRatio: '1:1',
    timestamp: 1790516671000,
    modelUsed: 'gemini-3.1-flash-image',
    status: 'completed',
    consistencyScore: 98,
    auditReport: {
      consistencyScore: 98,
      brandFidelitySummary: 'Exceptional preservation of the CyberPulse electric green vector emblem and black typography on ceramic glaze.',
      logoAssessment: 'Logo geometry is precisely wrapped to the mug curvature with authentic specular reflections and zero pixel distortion.',
      colorPaletteAssessment: 'Hex color values (#0A0A0A, #10B981, #84CC16) match the original reference can with calibrated fidelity.',
      materialRealismAssessment: 'Subtle ceramic micro-texture, glossy top-coat highlight, and ambient daylight shadows create photorealistic depth.',
      strengths: [
        'Curved cylindrical perspective wrap is mathematically accurate',
        'Electric lime brand color pop retained against white ceramic substrate',
        'Natural ambient cafe lighting matches commercial photography standard',
      ],
      suggestions: [
        'Could add personalized barista latte art nearby for additional lifestyle warmth',
      ],
    },
  },
  {
    id: 'init_billboard_frame',
    productId: 'prod_drink',
    mediumId: 'billboard',
    mediumName: 'Metropolitan Billboard',
    imageUrl: previewBillboardImg,
    promptUsed:
      'A colossal high-impact digital advertising billboard towering over a bustling metropolitan intersection like Times Square during blue-hour twilight with blurred taxi light trails below. The billboard displays an epic razor-sharp commercial advertisement for CyberPulse Energy Drink featuring the sleek black can and glowing electric lime typography.',
    aspectRatio: '16:9',
    timestamp: 1790516686000,
    modelUsed: 'gemini-3.1-flash-image',
    status: 'completed',
    consistencyScore: 96,
    auditReport: {
      consistencyScore: 96,
      brandFidelitySummary: 'Hero commercial scale achieved with striking neon night presence while maintaining complete product identity.',
      logoAssessment: 'High-contrast typography is readable from great architectural distance; silhouette matches reference can perfectly.',
      colorPaletteAssessment: 'Electric lime green ambient glow casts realistic neon bounced lighting onto surrounding facades.',
      materialRealismAssessment: 'LED pixel panel sub-structure and glass anti-reflective coating render realistically under dusk atmospheric conditions.',
      strengths: [
        'Massive commercial scale impact with believable metropolitan environment',
        'Can silhouette and geometric typography are instantly recognizable',
        'Cinematic color grading harmonizes with city twilight',
      ],
      suggestions: [
        'Consider day-lit variant for contrasting bright summer campaign evaluation',
      ],
    },
  },
  {
    id: 'init_tshirt_frame',
    productId: 'prod_drink',
    mediumId: 'tshirt',
    mediumName: 'Heavyweight T-Shirt',
    imageUrl: previewTshirtImg,
    promptUsed:
      'A premium heavyweight washed black streetwear cotton t-shirt in a clean fashion studio flat-lay, with the CyberPulse neon lime geometric cyber energy logo graphic screen-printed in the center chest, featuring authentic cotton fabric weave texture, realistic folds, and studio rim lighting.',
    aspectRatio: '1:1',
    timestamp: 1790516698000,
    modelUsed: 'gemini-3.1-flash-image',
    status: 'completed',
    consistencyScore: 97,
    auditReport: {
      consistencyScore: 97,
      brandFidelitySummary: 'Screenprint ink application accurately respects 280 GSM cotton ribbing, micro-fibers, and fabric folds.',
      logoAssessment: 'Chest print placement aligns with premium streetwear merchandise conventions; graphic elements are razor sharp.',
      colorPaletteAssessment: 'Fluorescent neon green ink retains vivid luminosity against washed vintage black dyed cotton.',
      materialRealismAssessment: 'Drape wrinkles across the torso physically deform the print with authentic ink stretch.',
      strengths: [
        'Fabric micro-texture and ink layer relief look tangible and authentic',
        'CyberPulse motif translates smoothly to apparel format',
        'Balanced studio lighting highlights cotton weave without washing out brand colors',
      ],
      suggestions: [
        'Optionally add back-print or sleeve tag mockups for full merchandise lineup',
      ],
    },
  },
];

