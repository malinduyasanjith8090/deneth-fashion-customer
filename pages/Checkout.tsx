import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../constants';
import { MessageCircle, CreditCard, Lock, ArrowLeft, Truck, MapPin, CheckCircle, ShoppingBag, Calendar, FileText, Package, QrCode, User } from 'lucide-react';
import { ViewState, CartItem } from '../types';

interface CheckoutProps {
  changeView: (view: ViewState) => void;
}

// Delivery fee structure based on destination
const DELIVERY_RATES: Record<string, number> = {
  'Colombo 1-15': 250,
  'Colombo (Suburb)': 300,
  'Gampaha': 350,
  'Kalutara': 350,
  'Kandy': 350,
  'Galle': 350,
  'Matara': 350,
  'Hambantota': 350,
  'Jaffna': 400,
  'Mannar': 400,
  'Trincomalee': 400,
  'Vavuniya': 400,
  'Ampara': 400,
  'Batticaloa': 400,
  'Kilinochchi': 400,
  'Mullaitivu': 400,
  'Kurunegala': 350,
  'Puttalam': 350,
  'Anuradhapura': 350,
  'Polonnaruwa': 350,
  'Badulla': 350,
  'Monaragala': 350,
  'Ratnapura': 350,
  'Kegalle': 350,
  'Matale': 350,
  'Nuwara Eliya': 350
};

const DISTRICTS = Object.keys(DELIVERY_RATES).sort();

interface OrderDetails {
  orderNumber: string;
  deliveryDate: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  customer: {
    name: string;
    city: string;
    district: string;
  };
}

export const Checkout: React.FC<CheckoutProps> = ({ changeView }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    district: 'Colombo 1-15',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'solo'>('cod');
  const [deliveryFee, setDeliveryFee] = useState(250);
  const [showQRModal, setShowQRModal] = useState(false);
  const [soloOrderReference, setSoloOrderReference] = useState('');
  
  // Order Confirmation State
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // Update delivery fee when district changes
  useEffect(() => {
    const fee = DELIVERY_RATES[formData.district] || 350;
    setDeliveryFee(fee);
  }, [formData.district]);

  const grandTotal = cartTotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual Validation Check for Alert
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
      alert("Please fill in all required shipping fields to proceed.");
      return;
    }

    if (paymentMethod === 'solo') {
      // Generate SOLO order reference
      const soloRef = `SOLO-${Math.floor(1000 + Math.random() * 9000)}`;
      setSoloOrderReference(soloRef);
      setShowQRModal(true);
      return;
    }

    if (paymentMethod === 'card') return; 

    processCODOrder();
  };

  const processCODOrder = () => {
    // Generate Order Details
    const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = new Date();
    date.setDate(date.getDate() + 3); // Estimated 3 days
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const details: OrderDetails = {
      orderNumber: orderNum,
      deliveryDate: formattedDate,
      items: [...cart], // Snapshot current items
      subtotal: cartTotal,
      deliveryFee: deliveryFee,
      grandTotal: grandTotal,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        city: formData.city,
        district: formData.district
      }
    };

    setOrderDetails(details);

    // Construct WhatsApp Message
    const itemsList = cart.map(item => `- ${item.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity}`).join('%0A');
    
    const message = `*New Order: ${orderNum}*%0A%0A*Customer:* ${formData.firstName} ${formData.lastName}%0A*Phone:* ${formData.phone}%0A*Address:* ${formData.address}, ${formData.city}, ${formData.district}%0A%0A*Order Details:*%0A${itemsList}%0A%0A*Subtotal:* Rs. ${cartTotal.toLocaleString()}%0A*Delivery (${formData.district}):* Rs. ${deliveryFee}%0A*Total Amount:* Rs. ${grandTotal.toLocaleString()}%0A%0A*Payment Method:* Cash on Delivery`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and show success view
    clearCart();
    setOrderComplete(true);
    window.scrollTo(0, 0);
  };

  const handleSoloPayment = () => {
    setShowQRModal(false);
    
    // Generate Order Details
    const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const details: OrderDetails = {
      orderNumber: orderNum,
      deliveryDate: formattedDate,
      items: [...cart],
      subtotal: cartTotal,
      deliveryFee: deliveryFee,
      grandTotal: grandTotal,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        city: formData.city,
        district: formData.district
      }
    };

    setOrderDetails(details);

    // Construct WhatsApp Message for SOLO payment with order reference
    const itemsList = cart.map(item => `- ${item.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity}`).join('%0A');
    
    const message = `*New Order (SOLO Payment): ${orderNum}*%0A%0A*Customer:* ${formData.firstName} ${formData.lastName}%0A*Phone:* ${formData.phone}%0A*Address:* ${formData.address}, ${formData.city}, ${formData.district}%0A%0A*Order Details:*%0A${itemsList}%0A%0A*Subtotal:* Rs. ${cartTotal.toLocaleString()}%0A*Delivery (${formData.district}):* Rs. ${deliveryFee}%0A*Total Amount:* Rs. ${grandTotal.toLocaleString()}%0A%0A*Payment Method:* SOLO App%0A*SOLO Reference:* ${soloOrderReference}%0A*Status:* Payment Pending Confirmation`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and show success view
    clearCart();
    setOrderComplete(true);
    window.scrollTo(0, 0);
  };

  // --- QR Code Modal ---
  const QRModal = () => {
    if (!showQRModal) return null;
    
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Customer';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-lg max-w-md w-full p-8 relative animate-slide-up">
          <button 
            onClick={() => setShowQRModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-black"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-serif font-bold mb-2">Scan to Pay</h3>
            <p className="text-gray-500 text-sm">Use SOLO app to scan this QR code or Screenshot and upload it</p>
          </div>
          
          {/* Customer Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center space-x-3">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-bold text-gray-900">{fullName}</p>
            </div>
          </div>
          
          {/* QR Code Image */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 flex justify-center">
            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
              {/* Replace this with your actual QR code image */}
              <img 
                src="/qrcode/qrcode.jpeg" 
                alt="SOLO Pay QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount to Pay:</span>
              <span className="text-2xl font-bold text-gray-900">Rs. {grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded font-bold">{soloOrderReference}</span>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="text-sm text-gray-500 mb-6 space-y-2">
            <p className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              Open SOLO app on your phone
            </p>
            <p className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              Tap on "Scan & Pay" and scan this QR code
            </p>
            <p className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              Complete the payment and click "I've Paid"
            </p>
            <p className="flex items-start text-xs text-blue-600 mt-2">
              <span className="font-bold mr-2">Note:</span>
              Reference {soloOrderReference} will be included in your WhatsApp confirmation
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowQRModal(false)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSoloPayment}
              className="flex-1 bg-black text-white px-4 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors"
            >
              I've Paid
            </button>
          </div>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            After payment, you'll be redirected to confirm your order via WhatsApp with reference {soloOrderReference}
          </p>
        </div>
      </div>
    );
  };

  // --- Order Confirmation View ---
  if (orderComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-12 pb-20 animate-fade-in">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
            
            {/* Success Header */}
            <div className="bg-black text-white p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-slide-up">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-300">Thank you for shopping with Deneth Fashion.</p>
            </div>

            <div className="p-8">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-100 pb-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order Number</p>
                    <p className="text-lg font-bold text-gray-900">{orderDetails.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Estimated Delivery</p>
                    <p className="text-lg font-bold text-gray-900">{orderDetails.deliveryDate}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary List */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {orderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-400">{item.quantity}x</span>
                        <span className="text-gray-800 font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500">({item.selectedSize}/{item.selectedColor})</span>
                      </div>
                      <span className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 my-4 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Subtotal</span>
                      <span>Rs. {orderDetails.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Delivery ({orderDetails.customer.district})</span>
                      <span>Rs. {orderDetails.deliveryFee}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-black border-t border-black pt-4">
                    <span>Total</span>
                    <span>Rs. {orderDetails.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  We have forwarded your order details to WhatsApp. <br/>
                  Our team will contact you shortly to confirm shipment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <button 
                     onClick={() => changeView('HOME')}
                     className="bg-black text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
                   >
                     Continue Shopping
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Empty Cart View ---
  if (cart.length === 0) {
     return (
        <div className="min-h-screen bg-white flex items-center justify-center flex-col p-4 animate-fade-in">
           <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
           <p className="text-gray-500 mb-6 text-lg">Your cart is empty.</p>
           <button 
              onClick={() => changeView('HOME')} 
              className="text-black font-bold underline underline-offset-4 hover:text-gray-700 transition-colors"
           >
              Return to Shop
           </button>
        </div>
     )
  }

  // --- Checkout Form View ---
  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-20 animate-fade-in">
      <QRModal />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <div className="flex items-center justify-between mb-8">
            <button 
            onClick={() => changeView('CART')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
            </button>
            <div className="hidden md:flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-300">
                <span className="text-black">Cart</span>
                <span>/</span>
                <span className="text-black">Information</span>
                <span>/</span>
                <span>Complete</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Form Section */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* Header */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                   <h1 className="text-2xl font-serif font-bold mb-1">Checkout</h1>
                   <p className="text-gray-500 text-sm">Please enter your shipping details to complete the order.</p>
                </div>

                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                
                {/* Shipping Details Card */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center text-gray-800 pb-4 border-b border-gray-50">
                        <MapPin className="w-4 h-4 mr-2" />
                        Shipping Address
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">First Name <span className="text-red-500">*</span></label>
                            <input 
                            required
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="e.g. Kasun"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Last Name <span className="text-red-500">*</span></label>
                            <input 
                            required
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="e.g. Perera"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Phone Number <span className="text-red-500">*</span></label>
                            <input 
                            required
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g. 071 234 5678"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">We'll use this to coordinate delivery.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Address <span className="text-red-500">*</span></label>
                            <input 
                            required
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Street Address, House No, Apartment"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">City / Town <span className="text-red-500">*</span></label>
                            <input 
                            required
                            type="text" 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g. Nugegoda"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">District <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 appearance-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all cursor-pointer"
                                >
                                    {DISTRICTS.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address (Optional)</label>
                            <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. kasun@example.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center text-gray-800 pb-4 border-b border-gray-50">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payment Method
                    </h2>
                    <div className="space-y-4">
                        
                        {/* Cash On Delivery */}
                        <div 
                           onClick={() => setPaymentMethod('cod')}
                           className={`relative flex items-start p-5 rounded-lg border cursor-pointer transition-all duration-200 ${paymentMethod === 'cod' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                           <div className="flex items-center h-5">
                             <input 
                               type="radio" 
                               name="payment" 
                               value="cod" 
                               checked={paymentMethod === 'cod'}
                               onChange={() => setPaymentMethod('cod')}
                               className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                             />
                           </div>
                           <div className="ml-4 flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <label className="font-bold text-gray-900 cursor-pointer">Cash on Delivery</label>
                                <MessageCircle className="w-5 h-5 text-green-600" />
                             </div>
                             <p className="text-sm text-gray-500">Pay accurately in cash upon delivery. We will confirm your order details via WhatsApp.</p>
                           </div>
                        </div>

                        {/* SOLO App Payment */}
                        <div 
                           onClick={() => setPaymentMethod('solo')}
                           className={`relative flex items-start p-5 rounded-lg border cursor-pointer transition-all duration-200 ${paymentMethod === 'solo' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                           <div className="flex items-center h-5">
                             <input 
                               type="radio" 
                               name="payment" 
                               value="solo" 
                               checked={paymentMethod === 'solo'}
                               onChange={() => setPaymentMethod('solo')}
                               className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                             />
                           </div>
                           <div className="ml-4 flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                    <label className="font-bold text-gray-900 cursor-pointer">SOLO App Payment</label>
                                    <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">New</span>
                                </div>
                                <QrCode className="w-5 h-5 text-blue-600" />
                             </div>
                             <p className="text-sm text-gray-500">Pay instantly using SOLO app. Scan QR code and complete payment.</p>
                           </div>
                        </div>

                        {/* Credit Card (Disabled) */}
                        <div className="relative flex items-start p-5 rounded-lg border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed">
                           <div className="flex items-center h-5">
                             <input 
                               type="radio" 
                               name="payment" 
                               value="card" 
                               disabled
                               className="h-4 w-4 text-gray-400 border-gray-300"
                             />
                           </div>
                           <div className="ml-4 flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                    <label className="font-bold text-gray-500 cursor-not-allowed">Online Payment</label>
                                    <span className="ml-2 text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Soon</span>
                                </div>
                                <CreditCard className="w-5 h-5 text-gray-400" />
                             </div>
                             <p className="text-sm text-gray-400">Secure card payments coming soon.</p>
                           </div>
                        </div>
                    </div>
                </div>
                </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
                <div className="bg-white p-6 md:p-8 rounded-lg sticky top-24 shadow-lg border border-gray-100 ring-1 ring-black/5">
                    <h2 className="text-xl font-serif font-bold mb-6 flex items-center">
                        Order Summary
                        <span className="ml-auto text-sm font-sans font-normal text-gray-400">{cart.length} Items</span>
                    </h2>
                    
                    {/* Items List */}
                    <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.cartId} className="flex gap-4 py-2">
                                <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{item.selectedSize} / {item.selectedColor}</p>
                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3 text-sm border-t border-gray-100 pt-6 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 items-center">
                            <span className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-gray-400" />
                                <span>Delivery <span className="text-xs text-gray-400">({formData.district})</span></span>
                            </span>
                            <span className="font-medium text-gray-900">Rs. {deliveryFee}</span>
                        </div>
                    </div>
                    
                    {/* Total */}
                    <div className="flex justify-between items-end border-t-2 border-dashed border-gray-200 pt-6 mb-8">
                        <div>
                            <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Total to Pay</span>
                            <span className="text-3xl font-sans font-bold text-gray-900">Rs. {grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                             <span className="text-xs text-gray-400 italic">Includes tax</span>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        form="checkout-form"
                        className="w-full bg-black text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center space-x-3 group"
                    >
                        <span>Confirm Order</span>
                        <CheckCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase tracking-wider">
                        <Lock className="w-3 h-3" />
                        <span>Secure Checkout via {paymentMethod === 'solo' ? 'SOLO App' : 'WhatsApp'}</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};