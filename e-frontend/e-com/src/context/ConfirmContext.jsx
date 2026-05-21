import React, { createContext, useContext, useState, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoWarningOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { Button } from '../components/ui/Button';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDanger: false,
  });

  const resolver = useRef(null);

  const confirm = (options) => {
    setConfig({
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you want to proceed?',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      isDanger: options.isDanger || false,
    });
    setIsOpen(true);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolver.current) resolver.current(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolver.current) resolver.current(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCancel}>
          
          {/* Backdrop - Clean Light-themed translucent gray-out overlay with soft blur */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-ink/20 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded bg-surface-container-lowest border border-outline-variant p-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                  
                  {/* Content Layout - Clean Left-Aligned with Small Circular Icon */}
                  <div className="flex items-start gap-4">
                    
                    {/* Small circular warning/info icon on left */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${
                      config.isDanger
                        ? 'bg-red-500/10 border-red-500/20 text-red-600'
                        : 'bg-primary-container/20 border-primary/10 text-primary'
                    }`}>
                      {config.isDanger ? (
                        <IoWarningOutline size={20} />
                      ) : (
                        <IoInformationCircleOutline size={20} />
                      )}
                    </div>

                    {/* Right side: Title & Description */}
                    <div className="space-y-1 flex-1">
                      <Dialog.Title as="h3" className="font-heading font-semibold text-xs tracking-widest uppercase text-ink leading-tight">
                        {config.title}
                      </Dialog.Title>
                      <p className="text-secondary text-[11px] leading-relaxed font-normal">
                        {config.message}
                      </p>
                    </div>

                  </div>

                  {/* Actions - Right-aligned bottom controls */}
                  <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-outline-variant">
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      size="sm"
                      className="px-4 py-2"
                    >
                      {config.cancelText}
                    </Button>
                    <Button
                      variant={config.isDanger ? 'danger' : 'primary'}
                      onClick={handleConfirm}
                      size="sm"
                      className="px-4 py-2 shadow-sm"
                    >
                      {config.confirmText}
                    </Button>
                  </div>

                </Dialog.Panel>
              </Transition.Child>
              
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </ConfirmContext.Provider>
  );
};
