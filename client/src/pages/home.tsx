import { useState, useEffect, useCallback } from "react"
import TopNavbar from "@/components/top-navbar"
import GlobeViewer from "@/components/globe-viewer"
import CountrySidebar from "@/components/country-sidebar"
import CountryDetail from "@/components/country-detail"
import CategorySidebar from "@/components/CategorySidebar" 

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false) 
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all-channels") 

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []) 

  useEffect(() => {
    const updateTime = () =>
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const handleGlobeCountryClick = (countryName: string) => {
    setSelectedChannel(null)
    setSelectedCountry(countryName)
    setActiveCategory("all-channels") 
    if (isMobile) setMobileSidebarOpen(true)
  }

  const handleSelectCountry = (country: string | null) => {
    setSelectedChannel(null)
    setSelectedCountry(country)
    setActiveCategory("all-channels") 
    if (isMobile && !country) setMobileSidebarOpen(false) 
  }
  
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category) 
    setSelectedCountry(null)    
    setSelectedChannel(null)    
    setIsCategorySidebarOpen(false) 
    
    if (isMobile && !mobileSidebarOpen) {
      setMobileSidebarOpen(true)
    }
  }

  const handleSelectChannel = (channel: string) => setSelectedChannel(channel)
  const handleBackFromPlayer = () => setSelectedChannel(null)
  const toggleMobileSidebar = () => {
    if (isMobile) setMobileSidebarOpen((prev) => !prev)
  }
  const toggleCategorySidebar = () => {
    setIsCategorySidebarOpen((prev) => !prev)
  }


  return (
    <div className="flex flex-col h-screen w-full bg-transparent text-white overflow-hidden">
      <TopNavbar 
        onMenuClick={toggleCategorySidebar}
        isMenuOpen={isCategorySidebarOpen}
      />

      <div className="flex-1 overflow-hidden relative">
        
        <div className="absolute inset-0 z-10 sm:right-[320px] lg:right-[340px]">
          <GlobeViewer
            selectedCountry={selectedCountry}
            onCountryClick={handleGlobeCountryClick}
            isMobile={isMobile}
          />
        </div>
        {!isMobile && selectedChannel && (selectedCountry || activeCategory !== "all-channels") && ( 
          <div
            className="absolute top-0 bottom-0 z-30 flex items-center justify-center p-4 sm:p-8 
                      left-0 right-0 sm:right-[320px] lg:right-[340px]"
          >
            <CountryDetail
              country={selectedCountry ?? activeCategory}
              channel={selectedChannel}
              onBack={handleBackFromPlayer}
              isMobile={isMobile}
              activeCategory={activeCategory} 
            />
          </div>
        )}
        {!isMobile && (
          <div
            className="absolute right-0 top-16 bottom-0 w-[320px] lg:w-[340px] z-20 bg-gray-900/90 backdrop-blur-md"
            role="complementary"
          >
            <CountrySidebar
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
              onSelectChannel={handleSelectChannel}
              onClose={() => {}}
              externalSearch={searchQuery}
              currentTime={currentTime}
              isMobile={isMobile}
              activeCategory={activeCategory} 
            />
          </div>
        )}

        <>
          <div
            className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-[#0B0D11] shadow-lg transform transition-transform duration-300 ease-in-out
              ${isCategorySidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <CategorySidebar
              activeCategory={activeCategory}
              onCategorySelect={handleCategorySelect}
              onClose={toggleCategorySidebar}
            />
          </div>
          {isCategorySidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30"
              onClick={toggleCategorySidebar}
            />
          )}
        </>


        {isMobile && (
          <>
            <div
              className={`fixed left-0 right-0 z-20 bg-[#0B0D11] transition-transform duration-500 
                ${mobileSidebarOpen ? "translate-y-0" : "translate-y-full"} 
                top-16 bottom-0 flex flex-col`}
            >
              {selectedChannel && (
                <div className="w-full bg-black flex-shrink-0 relative">
                  <CountryDetail
                    country={selectedCountry ?? activeCategory} 
                    channel={selectedChannel}
                    onBack={handleBackFromPlayer}
                    isMobile={isMobile}
                    activeCategory={activeCategory} 
                  />
                </div>
              )}
              
              <div
                onClick={toggleMobileSidebar}
                className={`w-full flex items-center justify-center cursor-grab flex-shrink-0 ${
                  selectedChannel ? 'py-0' : 'py-1.5'
                }`}
                aria-label="Toggle sidebar"
              >
                <span className="w-12 h-1.5 bg-gray-700 rounded-full" />
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scroll">
                <CountrySidebar
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleSelectCountry}
                  onSelectChannel={handleSelectChannel}
                  onClose={toggleMobileSidebar}
                  externalSearch={searchQuery}
                  currentTime={currentTime}
                  isMobile={isMobile} 
                  activeCategory={activeCategory} 
                />
              </div>
            </div>
            {mobileSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-10"
                onClick={toggleMobileSidebar}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
