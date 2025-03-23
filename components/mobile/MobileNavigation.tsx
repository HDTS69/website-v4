'use client';

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, ChevronRight, Menu, X, Phone, Calendar, Facebook, Instagram, Linkedin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavItem, BaseNavigationProps } from "@/types/navigation/types"
import { AnimatedBookNowButton } from "@/components/ui/AnimatedBookNowButton"

// Custom styles for the animated buttons
const customButtonStyles = `
  .book-online-btn .points_wrapper .point {
    background-color: white !important;
  }
  
  .call-now-btn .points_wrapper .point {
    background-color: #00E6CA !important;
  }
  
  .call-now-btn {
    background: white !important;
  }
  
  .call-now-btn .inner {
    color: #00E6CA !important;
  }
  
  .call-now-btn::after {
    background: white !important;
  }
  
  /* Make hero buttons the same width */
  .hero-buttons-container .animated-book-now-button {
    min-width: auto !important;
    width: 100% !important;
    text-align: center;
    justify-content: center;
    transition: all 0.3s ease !important;
  }
  
  .hero-buttons-container .inner {
    justify-content: center;
    width: 100%;
  }
  
  /* Glow effects on hover */
  .hero-buttons-container .book-online-btn:hover {
    box-shadow: 0 0 25px 4px rgba(0, 230, 202, 0.6) !important;
  }
  
  .hero-buttons-container .call-now-btn:hover {
    box-shadow: 0 0 25px 4px rgba(255, 255, 255, 0.5) !important;
  }
`;

/**
 * Enhanced Mobile Navigation component that provides a full-featured navigation experience.
 * Uses a single floating button that opens a full-page menu.
 */
export function Navigation({ items, actionItems = [], className }: BaseNavigationProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null)
  const [showFullMenu, setShowFullMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdowns when clicking outside navigation items
      if (!(event.target as Element).closest('.nav-item')) {
        setOpenDropdown(null)
        setOpenSubDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (showFullMenu) {
        setShowFullMenu(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showFullMenu])

  // Handle navigation item click
  const handleItemClick = (item: NavItem, isDropdownToggle: boolean = false) => {
    if (isDropdownToggle) {
      setOpenDropdown(openDropdown === item.name ? null : item.name)
      // Only close sub dropdown if we're closing the parent or opening a different parent
      if (openDropdown !== item.name) {
        setOpenSubDropdown(null)
      }
    } else {
      setActiveTab(item.name)
      setOpenDropdown(null)
      setOpenSubDropdown(null)
      setShowFullMenu(false)
    }
  }

  // Handle sub-item click
  const handleSubItemClick = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenSubDropdown(openSubDropdown === itemName ? null : itemName)
  }

  // Extract call and book buttons from actionItems
  const callButton = actionItems.find(item => item.name === "Call Now")
  const bookButton = actionItems.find(item => item.name === "Book Online")
  
  // Prepare regular navigation items
  const navItems = items.filter(item => 
    !item.name.toLowerCase().includes('call') && 
    !(item.name.toLowerCase().includes('book') && item.isHighlighted)
  );

  // Define animation variants for the full-page menu
  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <>
      {/* Inject custom button styles */}
      <style jsx global>{customButtonStyles}</style>
    
      {/* Full-page overlay when menu is open */}
      <AnimatePresence>
        {showFullMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex flex-col"
            ref={menuRef}
            style={{ touchAction: 'auto' }}
          >
            <div className="h-full flex flex-col">
              {/* Header with title only */}
              <div className="p-5 border-b border-[#00E6CA]/10">
                <h3 className="text-lg font-semibold text-[#00E6CA]">Menu</h3>
              </div>
              
              {/* Scrollable content */}
              <motion.div 
                className="flex-1 overflow-y-auto py-4 px-5"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Primary Navigation Items */}
                <div className="space-y-5 mb-8">
                  {navItems.map((item) => (
                    <motion.div variants={itemVariants} key={item.name} className="nav-item">
                      <div className="flex items-center justify-between">
                        {item.onClick ? (
                          <button
                            onClick={(e) => {
                              if (item.onClick) item.onClick(e)
                              setActiveTab(item.name)
                              setShowFullMenu(false)
                            }}
                            className="flex items-center gap-3 text-base font-medium text-white hover:text-[#00E6CA] transition-colors w-full text-left"
                          >
                            <item.icon size={20} strokeWidth={2} />
                            <span>{item.name}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.url}
                            onClick={() => {
                              setActiveTab(item.name)
                              if (!item.dropdownItems) setShowFullMenu(false)
                            }}
                            className="flex items-center gap-3 text-base font-medium text-white hover:text-[#00E6CA] transition-colors"
                          >
                            <item.icon size={20} strokeWidth={2} />
                            <span>{item.name}</span>
                          </Link>
                        )}
                        
                        {item.dropdownItems && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleItemClick(item, true)
                            }}
                            className={cn(
                              "p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-[#00E6CA] transition-colors",
                              openDropdown === item.name && "text-[#00E6CA] bg-white/5"
                            )}
                            aria-label={`Toggle ${item.name} dropdown`}
                          >
                            <ChevronDown
                              size={20}
                              className={cn(
                                "transition-transform duration-200",
                                openDropdown === item.name && "rotate-180"
                              )}
                            />
                          </button>
                        )}
                      </div>
                      
                      {/* Dropdown Items */}
                      <AnimatePresence>
                        {item.dropdownItems && openDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 pl-9 overflow-hidden"
                          >
                            <div className="space-y-4">
                              {item.dropdownItems.map((dropdownItem) => (
                                <div key={dropdownItem.name} className="border-l-2 border-[#00E6CA]/20 pl-4">
                                  <div className="flex items-center justify-between">
                                    <Link
                                      href={dropdownItem.url}
                                      onClick={() => {
                                        setActiveTab(item.name)
                                        if (!dropdownItem.subItems) {
                                          setShowFullMenu(false)
                                        }
                                      }}
                                      className="text-sm text-gray-300 hover:text-[#00E6CA] transition-colors"
                                    >
                                      {dropdownItem.name}
                                    </Link>
                                    
                                    {dropdownItem.subItems && (
                                      <button
                                        onClick={(e) => handleSubItemClick(e, dropdownItem.name)}
                                        className={cn(
                                          "p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-[#00E6CA] transition-colors",
                                          openSubDropdown === dropdownItem.name && "text-[#00E6CA] bg-white/5"
                                        )}
                                        aria-label={`Toggle ${dropdownItem.name} sub-menu`}
                                      >
                                        <ChevronDown
                                          size={16}
                                          className={cn(
                                            "transition-transform duration-200",
                                            openSubDropdown === dropdownItem.name && "rotate-180"
                                          )}
                                        />
                                      </button>
                                    )}
                                  </div>
                                  
                                  {/* Sub Items */}
                                  <AnimatePresence>
                                    {dropdownItem.subItems && openSubDropdown === dropdownItem.name && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-2 pl-4 space-y-3 pt-2"
                                      >
                                        {dropdownItem.subItems.map((subItem) => (
                                          <Link
                                            key={subItem.url}
                                            href={subItem.url}
                                            onClick={() => {
                                              setActiveTab(item.name)
                                              setShowFullMenu(false)
                                            }}
                                            className="block py-1 text-xs text-gray-400 hover:text-[#00E6CA] transition-colors"
                                          >
                                            {subItem.name}
                                          </Link>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Social Icons Section */}
                <div className="pt-4 border-t border-[#00E6CA]/10 mb-6">
                  <h4 className="text-sm font-medium text-white mb-4">Connect With Us</h4>
                  <div className="flex items-center gap-5">
                    <a 
                      href="https://facebook.com/hdtradeservices" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00E6CA]/10 hover:bg-[#00E6CA]/20 text-[#00E6CA] transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={18} />
                    </a>
                    <a 
                      href="https://instagram.com/hdtradeservices" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00E6CA]/10 hover:bg-[#00E6CA]/20 text-[#00E6CA] transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={18} />
                    </a>
                    <a 
                      href="https://twitter.com/hdtradeservices" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00E6CA]/10 hover:bg-[#00E6CA]/20 text-[#00E6CA] transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <X size={18} />
                    </a>
                    <a 
                      href="https://linkedin.com/company/hdtradeservices" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00E6CA]/10 hover:bg-[#00E6CA]/20 text-[#00E6CA] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
              
              {/* Footer with Call and Book buttons */}
              <div className="p-5 pb-24 border-t border-[#00E6CA]/10">
                <div className="grid grid-cols-2 gap-3 hero-buttons-container">
                  {callButton && (
                    <AnimatedBookNowButton 
                      href={callButton.url}
                      className="call-now-btn bg-white text-[#00E6CA]"
                      onClick={() => setShowFullMenu(false)}
                    >
                      Call Now
                    </AnimatedBookNowButton>
                  )}
                  
                  {bookButton && (
                    <AnimatedBookNowButton 
                      href={bookButton.url}
                      className="book-online-btn bg-[#00E6CA] text-white"
                      onClick={(e) => {
                        if (bookButton.onClick) {
                          e.preventDefault()
                          bookButton.onClick(e)
                        }
                        setShowFullMenu(false)
                      }}
                    >
                      Book Online
                    </AnimatedBookNowButton>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button that transforms between menu and close */}
      <AnimatePresence mode="wait">
        <motion.button
          key={showFullMenu ? "close" : "menu"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowFullMenu(!showFullMenu)}
          className={cn(
            "fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-lg",
            "flex items-center justify-center bg-[#00E6CA] text-black",
            "transform transition-transform active:scale-95"
          )}
          aria-label={showFullMenu ? "Close navigation menu" : "Open navigation menu"}
        >
          {showFullMenu ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </AnimatePresence>
    </>
  )
} 