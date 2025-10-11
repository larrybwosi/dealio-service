import { useState, useCallback, useMemo } from 'react';
import { Sidebar } from '@/components/pos/Sidebar';
import OrderQueues from '@/components/pos/OrderQueues';
import { ProductList } from '@/components/pos/ProductList';
import { CartDetails } from '@/components/pos/CartDetails';
import { CustomerManagement } from '@/components/pos/customers';
import PaymentModal from '@/components/pos/PaymentModal';
import { InvoiceModal } from '@/components/pos/InvoiceModal';
import { CartItem, Customer, Order, OrderType } from '@/types';
import { useOrgStore } from '@/lib/tanstack-axios';
import { useBusinessConfig } from '@/lib/business-config-manager';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { withAuth } from '@/providers/session';

function PosSystem() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('Dine in');
  const [tableNumber, setTableNumber] = useState<string>('Table 3B');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { taxRate } = useOrgStore();
  const businessConfig = useBusinessConfig();

  const [discountValue, setDiscountValue] = useState<number>(0);

  const { subtotal, discount, tax, total } = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = Math.min(discountValue, subtotal); // Ensure discount doesn't exceed subtotal
    const tax = (subtotal - discount) * Number(taxRate);
    const total = subtotal - discount + tax;
    return { subtotal, discount, tax, total };
  }, [cartItems, taxRate, discountValue]);


  const handleDiscountChange = useCallback(
    (value: number) => {
      // Ensure discount is not negative and doesn't exceed subtotal
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      console.log(subtotal, value);
      setDiscountValue(Math.max(0, Math.min(value, subtotal)));
    },
    [cartItems]
  );

  // Stable callback for adding to cart
  const handleAddToCart = useCallback((item: CartItem) => {
    setCartItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        cartItem => cartItem.id === item.id && cartItem.variant === item.variant && cartItem.addition === item.addition
      );

      if (existingItemIndex >= 0) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += item.quantity;
        return newItems;
      }
      return [...currentItems, item];
    });
  }, []);

  // Stable callback for updating quantity
  const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(currentItems => currentItems?.filter(item => item.id !== id));
      return;
    }

    setCartItems(currentItems =>
      currentItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  }, []);

  // Stable callback for removing item
  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(currentItems => currentItems?.filter(item => item.id !== id));
  }, []);

  // Stable callback for clearing cart
  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setDiscountValue(0); // Reset discount when clearing cart
  }, []);

  // Stable callback for opening customer modal
  const handleOpenCustomerModal = useCallback(() => {
    setIsCustomerModalOpen(true);
  }, []);

  // Stable callback for selecting customer
  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
  }, []);

  // Stable callback for opening payment modal
  const handleOpenPaymentModal = useCallback(() => {
    if (cartItems.length === 0) return;
    setIsPaymentModalOpen(true);
  }, [cartItems.length]);

  // Stable callback for handling payment completion
  const handlePaymentComplete = useCallback((order: Order) => {
    setCurrentOrder(order);
    setIsInvoiceModalOpen(true);

    if (order.status === 'completed') {
      setCartItems([]);
      setDiscountValue(0); // Reset discount after successful payment
      setSelectedCustomer(prevCustomer => {
        if (!prevCustomer || !prevCustomer.orderHistory) return prevCustomer;

        return {
          ...prevCustomer,
          orderHistory: [...prevCustomer.orderHistory, order.orderNumber],
          lastVisit: new Date().toISOString().split('T')[0],
        };
      });
    }
  }, []);

  // Memoized cart details props
  const cartDetailsProps = useMemo(
    () => ({
      cartItems,
      updateQuantity: handleUpdateQuantity,
      removeItem: handleRemoveItem,
      clearCart: handleClearCart,
      onProceedPayment: handleOpenPaymentModal,
      onOpenCustomer: handleOpenCustomerModal,
      selectedCustomer,
      selectedOrderType,
      setSelectedOrderType,
      tableNumber,
      setTableNumber,
      businessType: businessConfig.businessType,
      discountValue,
      onDiscountChange: handleDiscountChange,
    }),
    [
      cartItems,
      handleUpdateQuantity,
      handleRemoveItem,
      handleClearCart,
      handleOpenPaymentModal,
      handleOpenCustomerModal,
      selectedCustomer,
      selectedOrderType,
      tableNumber,
      businessConfig.businessType,
      discountValue,
      handleDiscountChange,
    ]
  );

  // Memoized payment modal props
  const paymentModalProps = useMemo(
    () => ({
      isOpen: isPaymentModalOpen,
      onClose: () => setIsPaymentModalOpen(false),
      cartItems,
      subtotal,
      discount,
      tax,
      total,
      customer: selectedCustomer,
      orderType: selectedOrderType,
      tableNumber,
      onOpenCustomer: handleOpenCustomerModal,
      onPaymentComplete: handlePaymentComplete,
    }),
    [
      isPaymentModalOpen,
      cartItems,
      subtotal,
      discount,
      tax,
      total,
      selectedCustomer,
      selectedOrderType,
      tableNumber,
      handleOpenCustomerModal,
      handlePaymentComplete,
    ]
  );

  return (
    <div className="flex flex-1 h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-hidden p-4">
        <div className="grid grid-cols-3 gap-4 h-screen">
          <div className="col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Orders & Products</h2>
              </div>
              <OrderQueues config={businessConfig.config} />
              <ScrollArea className="h-[calc(100vh-200px)]">
                <ProductList onAddToCart={handleAddToCart} />
              </ScrollArea>
            </div>
          </div>

          <div className="col-span-1 h-full">
            <CartDetails {...cartDetailsProps} />
          </div>
        </div>
      </div>

      <CustomerManagement
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelectCustomer={handleSelectCustomer}
      />

      <PaymentModal {...paymentModalProps} />

      {currentOrder && (
        <InvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} order={currentOrder} />
      )}
    </div>
  );
}

const IndexPage = withAuth(PosSystem);
export default IndexPage;
