import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import AlertModal from '../components/ui/AlertModal';
import SupportModal from '../components/ui/SupportModal';
import { useAlert } from '../hooks/useAlert';
import { Lock, Star, CheckCircle, MessageCircle, HelpCircle } from 'lucide-react';
import axios from 'axios';

const Premium: React.FC = () => {
  const [isPremium, setIspremium] = useState<boolean>(false)
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { alert, showError, showSuccess, hideAlert } = useAlert();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



    const token = sessionStorage.getItem('token')


  
    const Handlepurchase = async () => {
      if (!token) {
        showError('Authentication Required', 'You need to be logged in to purchase premium.');
        return;
      }
      
      // Check if user is verified
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.data.isVerified) {
        showError('Email Verification Required', 'You need to verify your email before purchasing premium. Please check your inbox.');
        return;
      }
    
      try {
      const isPremium = response.data.isPremium;
        const email = response.data.email;
    
        if (isPremium) {
          showSuccess('Already Premium', 'You already have an active premium subscription.');
          return;
        }
        
    
        // Agora cria a sessão de compra
        const paymentResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/purchase`,
          {
            email,        
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        const { url } = paymentResponse.data;
        window.open(url, "_blank");
      } catch (err) {
        showError('Purchase Error', 'Failed to start the purchase process. Please try again.');
      }
    };
    
    
    

  return (
    <main className="pt-20 min-h-screen bg-dark-300">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-primary-500">Premium</span> Access
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get unlimited access to all mega packs without restrictions. Premium membership coming soon.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-dark-200 to-dark-100 rounded-2xl shadow-xl overflow-hidden border border-dark-100 transition-transform hover:scale-[1.01] duration-300">
              <div className="bg-primary-500/10 px-6 py-4 border-b border-dark-100">
                <div className="flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary-500 mr-2" />
                  <span className="font-bold text-lg text-primary-400">Coming Soon</span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Premium Membership</h3>
                    <p className="text-gray-400 mb-6">Unlock the full potential of ShowLeaks</p>
                    
                    <div className="space-y-3 mb-8">
                      <Feature text="Unlimited access to all mega packs" />
                      <Feature text="No ads or waiting times" />
                      <Feature text="Direct download links" />
                      <Feature text="Priority support" />
                    </div>
                  </div>
                  
                  <div className="bg-dark-300 p-6 rounded-xl text-center">
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-4xl font-bold text-white">$12.00</span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full mb-3"
                      onClick={Handlepurchase}
                    >
                      <Lock size={16} className="mr-2" />
                      Coming Soon
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      Available soon. Join our waitlist.
                    </p>
                  </div>
              <Button 
                variant="outline"
                onClick={() => setShowSupportModal(true)}
              >
                <MessageCircle size={16} className="mr-2" />
                Contact Support
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setShowSupportModal(true)}
              >
                <HelpCircle size={16} className="mr-2" />
                View FAQ
              </Button>
            </div>
            
          </div>
        </div>
      </section>
      
      <AlertModal
        isOpen={alert.isOpen}
        onClose={hideAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        onConfirm={alert.onConfirm}
        showCancel={alert.showCancel}
      />

      <SupportModal 
        isOpen={showSupportModal} 
        onClose={() => setShowSupportModal(false)} 
      />
    </main>
  );
};

const Feature: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <CheckCircle size={18} className="text-primary-500 mr-3 flex-shrink-0" />
    <span className="text-gray-200">{text}</span>
  </div>
);

export default Premium;