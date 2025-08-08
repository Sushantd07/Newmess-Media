const categories = [
    {
      id: 'banking-services',
      name: 'Banking Services',
      icon: CreditCard,
      iconColor: 'bg-blue-500',
      count: '2,847',
      description: 'Account opening, NetBanking login, balance check, IFSC code, and customer care numbers.',
      trending: true,
      subcategories: 12
    },
    {
      id: 'upi-digital-payments',
      name: 'UPI & Digital Payments',
      icon: Wallet,
      iconColor: 'bg-green-500',
      count: '1,856',
      description: 'Includes help with UPI payments, failed transactions, refund status, and app activation.',
      trending: true,
      subcategories: 8
    },
    {
      id: 'mobile-recharge-plans',
      name: 'Mobile Recharge & Plans',
      icon: Smartphone,
      iconColor: 'bg-purple-500',
      count: '1,234',
      description: 'Related to prepaid/postpaid recharge, best mobile plans, data packs, and validity check.',
      trending: true,
      subcategories: 6
    },
    {
      id: 'telecom-services',
      name: 'Telecom Services',
      icon: Phone,
      iconColor: 'bg-indigo-500',
      count: '3,456',
      description: 'Common searches for SIM activation, mobile number portability, data issues, and network problems.',
      trending: true,
      subcategories: 15
    },
    {
      id: 'courier-delivery',
      name: 'Courier & Delivery',
      icon: Package,
      iconColor: 'bg-orange-500',
      count: '4,123',
      description: 'For package tracking, delivery delays, pickup requests, and complaint status.',
      trending: false,
      subcategories: 18
    },
    {
      id: 'ecommerce-shopping',
      name: 'E-commerce Shopping',
      icon: ShoppingCart,
      iconColor: 'bg-pink-500',
      count: '2,890',
      description: 'Queries about order status, return/refund, delivery issues, and payment failure.',
      trending: true,
      subcategories: 10
    },
    {
      id: 'online-food-delivery',
      name: 'Online Food Delivery',
      icon: Utensils,
      iconColor: 'bg-red-500',
      count: '1,678',
      description: 'Covers issues like late delivery, missing items, order cancelled, and refund requests.',
      trending: true,
      subcategories: 7
    },
    {
      id: 'cab-ride-hailing',
      name: 'Cab & Ride-Hailing',
      icon: Car,
      iconColor: 'bg-yellow-500',
      count: '5,234',
      description: 'Includes ride booking problems, fare overcharge, driver issue, and trip cancellation.',
      trending: false,
      subcategories: 25
    },
    {
      id: 'flight-booking-airlines',
      name: 'Flight Booking & Airlines',
      icon: Plane,
      iconColor: 'bg-sky-500',
      count: '2,145',
      description: 'Searches like ticket cancellation, flight reschedule, refund status, and baggage allowance.',
      trending: true,
      subcategories: 12
    },
    {
      id: 'train-irctc',
      name: 'Train & IRCTC',
      icon: Train,
      iconColor: 'bg-emerald-500',
      count: '1,867',
      description: 'Focus on PNR status, ticket booking, train delay updates, and IRCTC login issues.',
      trending: false,
      subcategories: 8
    },
    {
      id: 'bus-booking',
      name: 'Bus Booking',
      icon: Bus,
      iconColor: 'bg-cyan-500',
      count: '3,567',
      description: 'Related to bus ticket cancellation, seat availability, refund not received, and journey reschedule.',
      trending: false,
      subcategories: 14
    },
    {
      id: 'hotel-travel-booking',
      name: 'Hotel & Travel Booking',
      icon: Building2,
      iconColor: 'bg-violet-500',
      count: '1,456',
      description: 'Includes room booking issues, cancellation policy, early check-in, and booking confirmation.',
      trending: true,
      subcategories: 9
    },
    {
      id: 'ott-platforms',
      name: 'OTT Platforms',
      icon: Tv,
      iconColor: 'bg-rose-500',
      count: '2,934',
      description: 'Issues like login failure, subscription problems, buffering, and account not working.',
      trending: true,
      subcategories: 11
    },
    {
      id: 'dth-cable-tv',
      name: 'DTH & Cable TV',
      icon: Tv2,
      iconColor: 'bg-amber-500',
      count: '1,523',
      description: 'For recharge issues, no signal, channel missing, and set-top box problems.',
      trending: false,
      subcategories: 7
    },
    {
      id: 'broadband-wifi',
      name: 'Broadband & WiFi',
      icon: Wifi,
      iconColor: 'bg-teal-500',
      count: '2,234',
      description: 'Common queries include slow internet, WiFi not working, connection installation, and billing issues.',
      trending: false,
      subcategories: 9
    },
    {
      id: 'education-platforms',
      name: 'Education Platforms',
      icon: GraduationCap,
      iconColor: 'bg-blue-600',
      count: '1,945',
      description: 'Covers course access problems, certificate download, exam-related issues, and payment errors.',
      trending: true,
      subcategories: 13
    },
    {
      id: 'online-exams-results',
      name: 'Online Exams & Results',
      icon: FileText,
      iconColor: 'bg-green-600',
      count: '1,123',
      description: 'Includes admit card download, exam date, result delay, and answer key check.',
      trending: false,
      subcategories: 6
    },
    {
      id: 'government-services',
      name: 'Government Services',
      icon: Landmark,
      iconColor: 'bg-gray-600',
      count: '4,856',
      description: 'Popular topics: Aadhaar update, PAN card status, voter ID registration, and ration card check.',
      trending: false,
      subcategories: 20
    },
    {
      id: 'income-tax-gst',
      name: 'Income Tax & GST',
      icon: Calculator,
      iconColor: 'bg-slate-600',
      count: '2,367',
      description: 'For ITR filing, income tax refund, GST return, and login problems on portal.',
      trending: false,
      subcategories: 16
    },
    {
      id: 'insurance-health-life',
      name: 'Insurance (Health, Life)',
      icon: Shield,
      iconColor: 'bg-emerald-600',
      count: '1,734',
      description: 'Covers policy renewal, claim status, premium payment, and insurance document download.',
      trending: false,
      subcategories: 8
    },
    {
      id: 'mutual-funds-sips',
      name: 'Mutual Funds & SIPs',
      icon: TrendingUp,
      iconColor: 'bg-purple-600',
      count: '1,345',
      description: 'Includes SIP cancellation, NAV check, fund performance, and investment portfolio.',
      trending: true,
      subcategories: 10
    },
    {
      id: 'stock-market-apps',
      name: 'Stock Market Apps',
      icon: BarChart3,
      iconColor: 'bg-red-600',
      count: '1,623',
      description: 'Common issues like KYC pending, fund transfer failed, trading app crash, and login problem.',
      trending: true,
      subcategories: 12
    },
    {
      id: 'loans-home-personal',
      name: 'Loans (Home, Personal)',
      icon: Banknote,
      iconColor: 'bg-orange-600',
      count: '2,134',
      description: 'Queries for loan eligibility, EMI calculator, interest rates, and closure letter.',
      trending: false,
      subcategories: 14
    },
    {
      id: 'credit-score-cibil',
      name: 'Credit Score & CIBIL',
      icon: Award,
      iconColor: 'bg-yellow-600',
      count: '1,456',
      description: 'Searches about credit score check, CIBIL report correction, and score improvement tips.',
      trending: true,
      subcategories: 8
    },
    {
      id: 'hospitals-clinics',
      name: 'Hospitals & Clinics',
      icon: Stethoscope,
      iconColor: 'bg-pink-600',
      count: '3,234',
      description: 'For doctor appointment, consultation fee, test report, and OPD schedule.',
      trending: false,
      subcategories: 18
    },
    {
      id: 'diagnostics-lab-tests',
      name: 'Diagnostics & Lab Tests',
      icon: TestTube,
      iconColor: 'bg-cyan-600',
      count: '1,823',
      description: 'Related to sample collection, lab report download, test prices, and report delay.',
      trending: false,
      subcategories: 11
    },
    {
      id: 'job-portals',
      name: 'Job Portals',
      icon: Briefcase,
      iconColor: 'bg-indigo-600',
      count: '2,567',
      description: 'Includes profile update, job alerts, application tracking, and resume upload issues.',
      trending: true,
      subcategories: 15
    },
    {
      id: 'resume-making',
      name: 'Resume Making',
      icon: FileText,
      iconColor: 'bg-violet-600',
      count: '934',
      description: 'Covers resume builder, CV format, online templates, and free download options.',
      trending: true,
      subcategories: 6
    },
    {
      id: 'real-estate',
      name: 'Real Estate',
      icon: Home,
      iconColor: 'bg-emerald-500',
      count: '1,745',
      description: 'For property listings, rent agreements, broker contact, and site visit booking.',
      trending: false,
      subcategories: 12
    },
    {
      id: 'electricity-services',
      name: 'Electricity Services',
      icon: Zap,
      iconColor: 'bg-yellow-500',
      count: '2,834',
      description: 'Searches like bill payment, load increase, power cut complaint, and duplicate bill download.',
      trending: false,
      subcategories: 16
    },
    {
      id: 'water-gas-services',
      name: 'Water & Gas Services',
      icon: Droplets,
      iconColor: 'bg-blue-500',
      count: '1,567',
      description: 'Includes gas booking, water bill check, connection complaint, and leakage report.',
      trending: false,
      subcategories: 9
    },
    {
      id: 'online-shopping-returns',
      name: 'Online Shopping Returns',
      icon: Package,
      iconColor: 'bg-orange-500',
      count: '2,234',
      description: 'Focus on return request, replacement delays, refund not credited, and pickup issues.',
      trending: true,
      subcategories: 13
    },
    {
      id: 'wallets-payment-apps',
      name: 'Wallets & Payment Apps',
      icon: CreditCard,
      iconColor: 'bg-purple-500',
      count: '1,923',
      description: 'Covers KYC update, transaction failure, balance not showing, and money deducted issues.',
      trending: true,
      subcategories: 11
    },
    {
      id: 'gaming-apps',
      name: 'Gaming Apps',
      icon: Gamepad2,
      iconColor: 'bg-green-500',
      count: '1,345',
      description: 'Common queries about account banned, purchase not credited, login failed, and lagging issues.',
      trending: true,
      subcategories: 8
    },
    {
      id: 'fantasy-sports',
      name: 'Fantasy Sports',
      icon: Target,
      iconColor: 'bg-amber-500',
      count: '823',
      description: 'For team not updating, contest entry failed, withdrawal issue, and verification pending.',
      trending: true,
      subcategories: 5
    },
    {
      id: 'online-shopping-offers',
      name: 'Online Shopping Offers',
      icon: Gift,
      iconColor: 'bg-red-500',
      count: '3,123',
      description: 'Searches include discount codes, cashback offers, sale start dates, and limited time deals.',
      trending: true,
      subcategories: 17
    },
    {
      id: 'freelancing-platforms',
      name: 'Freelancing Platforms',
      icon: Users,
      iconColor: 'bg-indigo-500',
      count: '1,234',
      description: 'Includes payment pending, gig approval, account issues, and client disputes.',
      trending: true,
      subcategories: 7
    },
    {
      id: 'freight-movers',
      name: 'Freight & Movers',
      icon: Truck,
      iconColor: 'bg-gray-500',
      count: '1,634',
      description: 'For shipment tracking, damage claim, pickup reschedule, and delivery not done.',
      trending: false,
      subcategories: 10
    },
    {
      id: 'legal-court-services',
      name: 'Legal & Court Services',
      icon: Scale,
      iconColor: 'bg-amber-600',
      count: '923',
      description: 'Covers online FIR, case status check, RTI filing, and legal consultation.',
      trending: false,
      subcategories: 6
    },
    {
      id: 'driving-license-rto',
      name: 'Driving License & RTO',
      icon: Car,
      iconColor: 'bg-blue-600',
      count: '2,456',
      description: 'Topics like DL application, license renewal, vehicle registration, and road tax payment.',
      trending: false,
      subcategories: 14
    },
    {
      id: 'petrol-diesel-prices',
      name: 'Petrol & Diesel Prices',
      icon: Fuel,
      iconColor: 'bg-orange-600',
      count: '1,123',
      description: 'Searches include fuel price today, CNG/LPG rates, and city-wise fuel updates.',
      trending: false,
      subcategories: 7
    },
    {
      id: 'gold-silver-rates',
      name: 'Gold & Silver Rates',
      icon: DollarSign,
      iconColor: 'bg-yellow-500',
      count: '834',
      description: 'For gold rate today, silver price in grams, 22k/24k difference, and rate alerts.',
      trending: false,
      subcategories: 5
    },
    {
      id: 'passport-services',
      name: 'Passport Services',
      icon: Globe,
      iconColor: 'bg-blue-500',
      count: '1,734',
      description: 'Queries about passport status, document checklist, slot booking, and renewal process.',
      trending: false,
      subcategories: 11
    },
    {
      id: 'visa-immigration',
      name: 'Visa & Immigration',
      icon: Globe,
      iconColor: 'bg-green-600',
      count: '1,345',
      description: 'Includes visa tracking, appointment slots, embassy contact, and VFS issues.',
      trending: false,
      subcategories: 8
    },
    {
      id: 'airports-flights',
      name: 'Airports & Flights',
      icon: Plane,
      iconColor: 'bg-sky-600',
      count: '2,023',
      description: 'Searches: flight delayed, check-in help, luggage limit, airport terminal info.',
      trending: false,
      subcategories: 12
    },
    {
      id: 'train-live-status',
      name: 'Train Live Status',
      icon: Navigation,
      iconColor: 'bg-emerald-600',
      count: '1,823',
      description: 'For train running status, real-time tracking, arrival time, and platform number.',
      trending: true,
      subcategories: 10
    },
    {
      id: 'newspapers-news-portals',
      name: 'Newspapers & News Portals',
      icon: Newspaper,
      iconColor: 'bg-gray-600',
      count: '1,534',
      description: 'Includes e-paper access, breaking news, regional updates, and daily headlines.',
      trending: false,
      subcategories: 9
    },
    {
      id: 'health-wellness-apps',
      name: 'Health & Wellness Apps',
      icon: Activity,
      iconColor: 'bg-green-500',
      count: '1,234',
      description: 'Covers fitness tracker issues, diet plan access, meditation app crash, and subscription plans.',
      trending: true,
      subcategories: 7
    },
    {
      id: 'beauty-grooming',
      name: 'Beauty & Grooming',
      icon: Heart,
      iconColor: 'bg-pink-500',
      count: '1,023',
      description: 'Searches about salon booking, beauty service delay, appointment confirmation, and home grooming.',
      trending: false,
      subcategories: 6
    },
    {
      id: 'fashion-apparel',
      name: 'Fashion & Apparel',
      icon: Shirt,
      iconColor: 'bg-purple-500',
      count: '2,634',
      description: 'For size mismatch, return clothes, fashion trends, and delivery not received.',
      trending: true,
      subcategories: 15
    }
  ];
