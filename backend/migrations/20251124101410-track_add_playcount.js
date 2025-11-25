module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    console.log('Adding playCount field to all tracks...');
    
    // Add playCount field with default value 0 to all tracks that don't have it
    const result = await db.collection('tracks').updateMany(
      { playCount: { $exists: false } },
      { $set: { playCount: 0 } }
    );
    
    console.log(`Updated ${result.modifiedCount} tracks with playCount field`);
    
    // Also ensure all existing tracks have playCount (set to 0 if null/undefined)
    const result2 = await db.collection('tracks').updateMany(
      { $or: [{ playCount: null }, { playCount: { $exists: false } }] },
      { $set: { playCount: 0 } }
    );
    
    console.log(`Ensured ${result2.modifiedCount} tracks have valid playCount`);
    
    // Create index on playCount for performance
    await db.collection('tracks').createIndex({ playCount: -1 });
    console.log('Created index on playCount field');
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    console.log('Removing playCount field from all tracks...');
    
    // Remove the playCount field from all tracks
    const result = await db.collection('tracks').updateMany(
      {},
      { $unset: { playCount: '' } }
    );
    
    console.log(`Removed playCount from ${result.modifiedCount} tracks`);
    
    // Drop the index
    try {
      await db.collection('tracks').dropIndex({ playCount: -1 });
      console.log('Dropped index on playCount field');
    } catch (error) {
      console.log('Index on playCount may not exist, skipping drop');
    }
  }
};
