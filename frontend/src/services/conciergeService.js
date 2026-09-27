import { productsData } from '../data/products';
import { marketsData } from '../data/marketsData';
import { farmersData } from '../data/farmersData';

/**
 * MarketLink Community Help Desk Service
 * Resolves shopper inquiries regarding market schedules, fresh inventory, pickup logistics, and portal access.
 */
export function getSupportResponse(userQuery, context = {}) {
  const query = userQuery.trim().toLowerCase();

  // 1. Markets & Locations Inquiry
  if (
    query.includes('market') ||
    query.includes('where') ||
    query.includes('location') ||
    query.includes('map') ||
    query.includes('timing') ||
    query.includes('time') ||
    query.includes('open') ||
    query.includes('schedule') ||
    query.includes('saturday') ||
    query.includes('sunday')
  ) {
    const days = ['saturday', 'sunday', 'wednesday', 'friday'];
    const matchedDay = days.find((d) => query.includes(d));

    if (matchedDay) {
      const openMarkets = marketsData.filter((m) =>
        m.operatingDays.map((d) => d.toLowerCase()).includes(matchedDay)
      );

      const marketList = openMarkets
        .map(
          (m) =>
            `• **${m.name}**\n  Location: ${m.location}\n  Hours: ${m.timings} (${m.activeFarmers} active farm stalls)`
        )
        .join('\n\n');

      return {
        text: `Here are the market locations open on **${matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)}**:\n\n${marketList}\n\nYou can click below to view their exact locations and get directions on our interactive map.`,
        actions: [
          { label: 'View Markets Map', path: '/markets', icon: 'fa-map-marked-alt' },
          { label: 'Browse Produce', path: '/products', icon: 'fa-carrot' }
        ],
        suggestions: ['How does pickup work?', 'Which stalls have fresh vegetables?']
      };
    }

    const allMarkets = marketsData
      .map(
        (m) =>
          `• **${m.name}** (${m.operatingDays.join(', ')})\n  Location: ${m.location} | Hours: ${m.timings}`
      )
      .join('\n\n');

    return {
      text: `We currently host **${marketsData.length} certified farmers markets**:\n\n${allMarkets}\n\nSelect a market below to view its stalls and live directions.`,
      actions: [
        { label: 'Open Interactive Map', path: '/markets', icon: 'fa-map-pin' },
        { label: 'View All Harvest', path: '/products', icon: 'fa-carrot' }
      ],
      suggestions: ['Markets open this Saturday', 'What are the pickup hours?']
    };
  }

  // 2. Payment & Pickup Policy (Strict Project Rule)
  if (
    query.includes('pay') ||
    query.includes('payment') ||
    query.includes('cash') ||
    query.includes('card') ||
    query.includes('deliver') ||
    query.includes('shipping') ||
    query.includes('pickup') ||
    query.includes('cost') ||
    query.includes('order')
  ) {
    return {
      text: `### How Pre-Orders & Pickup Work:\n\n1. **No Online Payment**: Pre-orders are completely free to reserve. You pay the farmer **in cash or in person at the stall** when you collect your order.\n\n2. **Stall Pickup Only**: To maintain zero delivery emissions and guarantee peak freshness, items are picked up directly from the farmer's stall at the market (no home delivery).\n\n3. **Scheduled Windows**: Select your convenient date and pickup time slot during checkout. The farmer packs your harvest in advance so it is ready when you arrive.`,
      actions: [
        { label: 'Start a Pre-Order', path: '/products', icon: 'fa-shopping-basket' },
        { label: 'Track My Orders', path: '/customer', icon: 'fa-box' }
      ],
      suggestions: ['How to cancel an order?', 'What fresh produce is in stock?']
    };
  }

  // 3. Fresh Produce & Inventory Inquiry
  if (
    query.includes('produce') ||
    query.includes('tomato') ||
    query.includes('fruit') ||
    query.includes('vegetable') ||
    query.includes('dairy') ||
    query.includes('bakery') ||
    query.includes('bread') ||
    query.includes('cheese') ||
    query.includes('apple') ||
    query.includes('price') ||
    query.includes('under') ||
    query.includes('$')
  ) {
    const under5Match = query.includes('under 5') || query.includes('under $5') || query.includes('cheap');
    const targetProducts = under5Match
      ? productsData.filter((p) => p.price <= 5.0)
      : productsData.slice(0, 4);

    const productList = targetProducts
      .map(
        (p) =>
          `• **${p.name}** - $${p.price.toFixed(2)} / ${p.unit} (${p.farmerName} at ${p.marketName})`
      )
      .join('\n');

    return {
      text: under5Match
        ? `Here are freshly listed organic items under **$5.00**:\n\n${productList}\n\nYou can add them to your pre-order basket right now.`
        : `Here are popular seasonal crops ready for reservation:\n\n${productList}\n\nBrowse our full catalog to reserve items before harvest cut-off.`,
      actions: [
        { label: 'Browse Produce Catalog', path: '/products', icon: 'fa-carrot' }
      ],
      suggestions: ['Show produce under $5', 'How does stall pickup work?']
    };
  }

  // 4. Role Portals Navigation Inquiry
  if (
    query.includes('portal') ||
    query.includes('dashboard') ||
    query.includes('farmer') ||
    query.includes('grower') ||
    query.includes('admin') ||
    query.includes('role') ||
    query.includes('customer') ||
    query.includes('seller')
  ) {
    return {
      text: `MarketLink provides dedicated portals for all participants:\n\n• **Customer Portal**: View active pre-orders, review progress timeline, manage favorite stalls.\n• **Farmer Portal**: Manage weekly inventory stock, accept customer reservations, mark orders ready for Saturday collection.\n• **Platform Admin**: Oversee farmer certifications, stall allocations, and zero-waste metrics.`,
      actions: [
        { label: 'Customer Portal', path: '/customer', icon: 'fa-user' },
        { label: 'Farmer Stall Portal', path: '/farmer', icon: 'fa-tractor' },
        { label: 'Admin Dashboard', path: '/admin', icon: 'fa-shield-alt' }
      ],
      suggestions: ['How to place an order?', 'Where are markets located?']
    };
  }

  // 5. General Fallback
  return {
    text: `I'm here to help you navigate **MarketLink**.\n\nYou can ask about:\n• Market operating days and map directions\n• Our cash-on-pickup and zero-delivery policy\n• In-season organic produce and pricing\n• Switching between Customer, Farmer, and Admin dashboards`,
    actions: [
      { label: 'Browse Produce', path: '/products', icon: 'fa-carrot' },
      { label: 'View Markets Map', path: '/markets', icon: 'fa-map-marked-alt' }
    ],
    suggestions: [
      'What markets are open this Saturday?',
      'How does cash payment work?',
      'Show produce under $5'
    ]
  };
}

export const getAssistantResponse = getSupportResponse;

