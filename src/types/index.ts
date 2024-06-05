export type Currency = {
  id: "string";
  description: "string";
};

export type Order = {
  id: number;
  comments: string | null;
  status: string;
  status_detail: {
    description: string | null;
    code: number | null;
  };
  date_created: string;
  date_closed: string;
  expiration_date: string;
  date_last_updated: string;
  hidden_for_seller: boolean;
  currency_id: string;
  order_items: OrderItem[];
  total_amount: number;
  mediations: any[]; // Aquí deberías definir un tipo específico si lo tienes
  payments: Payment[];
  shipping: Shipping;
  buyer: Buyer;
  seller: Seller;
  feedback: {
    sale: any; // Tipo específico si está disponible
    purchase: any; // Tipo específico si está disponible
  };
  tags: string[];
};

export type OrderItem = {
  currency_id: string;
  item: {
    id: string;
    title: string;
    seller_custom_field: string | null;
    variation_attributes: any[]; // Tipo específico si está disponible
    category_id: string;
    variation_id: string | null;
    seller_sku: string;
  };
  sale_fee: number;
  quantity: number;
  unit_price: number;
};

export type Payment = {
  id: number;
  order_id: number;
  payer_id: number;
  collector: {
    id: number;
  };
  currency_id: string;
  status: string;
  status_code: string;
  status_detail: string;
  transaction_amount: number;
  shipping_cost: number;
  overpaid_amount: number;
  total_paid_amount: number;
  marketplace_fee: any; // Tipo específico si está disponible
  coupon_amount: number;
  date_created: string;
  date_last_modified: string;
  card_id: string | null;
  reason: string;
  activation_uri: string | null;
  payment_method_id: string;
  installments: number;
  issuer_id: string;
  atm_transfer_reference: {
    company_id: string | null;
    transaction_id: string | null;
  };
  coupon_id: string | null;
  operation_type: string;
  payment_type: string;
  available_actions: string[]; // Tipo específico si está disponible
  installment_amount: number;
  deferred_period: string | null;
  date_approved: string;
  authorization_code: string;
  transaction_order_id: string;
};

export type Shipping = {
  substatus: string | null;
  status: string;
  id: string | null;
  service_id: string | null;
  currency_id: string | null;
  shipping_mode: string | null;
  shipment_type: string | null;
  sender_id: string | null;
  picking_type: string | null;
  date_created: string | null;
  cost: number | null;
  date_first_printed: string | null;
};

export type Buyer = {
  id: number;
  nickname: string;
  email: string;
  phone: Phone;
  alternative_phone: Phone;
  first_name: string;
  last_name: string;
  billing_info: {
    doc_type: string | null;
    doc_number: string | null;
  };
};

export type Seller = {
  id: number;
  nickname: string;
  email: string;
  phone: Phone;
  alternative_phone: Phone;
  first_name: string;
  last_name: string;
};

export type Phone = {
  area_code: string;
  number: string;
  extension: string;
  verified: boolean;
};

