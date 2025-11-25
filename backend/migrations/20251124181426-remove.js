module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // Remove the "available_markets" field from all albums
    await db
      .collection('albums')
      .updateMany(
        { available_markets: { $exists: true } },
        { $unset: { available_markets: '' } },
      );
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // Since available_markets is being removed, we can't restore original values.
    // If needed, restore as empty array.
    await db
      .collection('albums')
      .updateMany(
        { available_markets: { $exists: false } },
        { $set: { available_markets: [] } },
      );
  },
};
