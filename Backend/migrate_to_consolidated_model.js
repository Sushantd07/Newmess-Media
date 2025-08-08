import mongoose from 'mongoose';
import Subcategory from './src/models/Subcategory.js';
import CompanyPage from './src/models/CompanyPage.js';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your_database_name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function to consolidate data
const migrateToConsolidatedModel = async () => {
  try {
    console.log('🔄 Starting migration to consolidated model...');
    
    // Get all company pages
    const companyPages = await CompanyPage.find({});
    console.log(`📊 Found ${companyPages.length} company pages to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const companyPage of companyPages) {
      try {
        // Find corresponding subcategory
        const subcategory = await Subcategory.findOne({
          $or: [
            { id: companyPage.slug },
            { slug: companyPage.slug },
            { name: companyPage.name }
          ]
        });
        
        if (!subcategory) {
          console.log(`⚠️  No subcategory found for company: ${companyPage.name}`);
          skippedCount++;
          continue;
        }
        
        // Update subcategory with company page data
        const updateData = {
          // Company page fields
          description: companyPage.description || '',
          companyName: companyPage.name || '',
          mainPhone: companyPage.mainPhone || '',
          website: companyPage.website || '',
          founded: companyPage.founded || '',
          headquarters: companyPage.headquarters || '',
          parentCompany: companyPage.parentCompany || '',
          rating: companyPage.rating || 0,
          totalReviews: companyPage.totalReviews || 0,
          
          // Tab references
          'tabs.numbers': companyPage.tabs?.numbers || null,
          'tabs.complaints': companyPage.tabs?.complaints || null,
          'tabs.quickhelp': companyPage.tabs?.quickhelp || null,
          'tabs.video': companyPage.tabs?.video || null,
          'tabs.overview': companyPage.tabs?.overview || null,
        };
        
        await Subcategory.findByIdAndUpdate(subcategory._id, updateData);
        console.log(`✅ Migrated: ${companyPage.name}`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ Error migrating ${companyPage.name}:`, error.message);
        skippedCount++;
      }
    }
    
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount}`);
    console.log(`⚠️  Skipped: ${skippedCount}`);
    console.log(`📊 Total processed: ${companyPages.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await migrateToConsolidatedModel();
  
  console.log('\n🎉 Migration completed!');
  process.exit(0);
};

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 