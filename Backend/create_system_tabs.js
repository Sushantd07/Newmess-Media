import mongoose from 'mongoose';
import Tab from './src/models/Tab.js';

const MONGODB_URI = 'mongodb://localhost:27017/your_database';

// System tabs that should be available by default
const systemTabs = [
  {
    tabId: 'overview',
    name: 'overview',
    label: 'Overview',
    icon: 'BarChart',
    type: 'system',
    order: 1,
    createdBy: 'system'
  },
  {
    tabId: 'contact-numbers',
    name: 'contact-numbers',
    label: 'Contact Numbers',
    icon: 'Phone',
    type: 'system',
    order: 2,
    createdBy: 'system'
  },
  {
    tabId: 'complaints',
    name: 'complaints',
    label: 'Complaint Redressal Process',
    icon: 'FileText',
    type: 'system',
    order: 3,
    createdBy: 'system'
  },
  {
    tabId: 'quick-help',
    name: 'quick-help',
    label: 'Quick Help',
    icon: 'HelpCircle',
    type: 'system',
    order: 4,
    createdBy: 'system'
  },
  {
    tabId: 'video-guide',
    name: 'video-guide',
    label: 'Video Guide',
    icon: 'PlayCircle',
    type: 'system',
    order: 5,
    createdBy: 'system'
  }
];

async function createSystemTabs() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗂️ Creating system tabs...');
    
    for (const tabData of systemTabs) {
      // Check if tab already exists
      const existingTab = await Tab.findOne({ tabId: tabData.tabId });
      
      if (existingTab) {
        console.log(`⚠️ Tab ${tabData.label} already exists, skipping...`);
        continue;
      }

      // Create new system tab
      const newTab = new Tab(tabData);
      await newTab.save();
      console.log(`✅ Created system tab: ${tabData.label}`);
    }

    console.log('🎉 System tabs creation completed!');
    
    // List all tabs
    const allTabs = await Tab.find().sort({ order: 1 });
    console.log('\n📋 All available tabs:');
    allTabs.forEach(tab => {
      console.log(`  - ${tab.label} (${tab.type}) - Order: ${tab.order}`);
    });

  } catch (error) {
    console.error('❌ Error creating system tabs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the creation
createSystemTabs();


