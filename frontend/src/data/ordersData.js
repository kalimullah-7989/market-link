export const sampleOrdersData = [
  {
    id: 'ORD-7821',
    customerId: 6,
    customerName: 'Hamza Ali',
    customerPhone: '+92 300 1234567',
    farmerId: 2,
    farmerName: 'Punjab Green Organics',
    marketName: 'Liberty Sunday Farmers Market',
    stallNumber: 'Stall #A-04',
    pickupDate: '2026-09-29',
    timeSlot: '08:30 AM - 10:30 AM',
    items: [
      { id: 1, name: 'Heirloom Vine Tomato', quantity: 3, unit: 'kg', price: 4.50 },
      { id: 3, name: 'Crisp Green Bell Pepper', quantity: 2, unit: 'kg', price: 3.20 }
    ],
    totalAmount: 19.90,
    pickupToken: 'PKP-8921A',
    status: 'ready_for_pickup',
    payOnPickup: true,
    placedAt: '2026-09-25T14:30:00Z',
    notes: 'Please pack in eco-friendly paper crate.'
  },
  {
    id: 'ORD-7819',
    customerId: 6,
    customerName: 'Hamza Ali',
    customerPhone: '+92 300 1234567',
    farmerId: 2,
    farmerName: 'Punjab Green Organics',
    marketName: 'Liberty Sunday Farmers Market',
    stallNumber: 'Stall #A-04',
    pickupDate: '2026-09-30',
    timeSlot: '09:30 AM - 11:30 AM',
    items: [
      { id: 4, name: 'Sweet Field Strawberries', quantity: 2, unit: 'box (500g)', price: 6.50 },
      { id: 6, name: 'Valencia Sweet Orange', quantity: 3, unit: 'kg', price: 4.20 }
    ],
    totalAmount: 25.60,
    pickupToken: 'PKP-4402B',
    status: 'accepted',
    payOnPickup: true,
    placedAt: '2026-09-25T16:15:00Z',
    notes: 'Morning fresh harvest preferred.'
  },
  {
    id: 'ORD-7804',
    customerId: 6,
    customerName: 'Hamza Ali',
    customerPhone: '+92 300 1234567',
    farmerId: 2,
    farmerName: 'Punjab Green Organics',
    marketName: 'Liberty Sunday Farmers Market',
    stallNumber: 'Stall #A-04',
    pickupDate: '2026-09-20',
    timeSlot: '10:30 AM - 12:30 PM',
    items: [
      { id: 1, name: 'Farm Fresh Tomatoes', quantity: 2, unit: 'kg', price: 4.80 },
      { id: 5, name: 'English Garden Cucumber', quantity: 1, unit: 'kg', price: 2.80 }
    ],
    totalAmount: 12.40,
    pickupToken: 'PKP-7109C',
    status: 'completed',
    payOnPickup: true,
    placedAt: '2026-09-19T10:00:00Z',
    ratingGiven: 5,
    reviewGiven: 'Exceptional fresh produce from Tariq Mehmood. Picked up smoothly at Liberty.'
  }
];
