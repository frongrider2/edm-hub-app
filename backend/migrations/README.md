# Database Migrations

## Overview
This directory contains MongoDB migrations managed by `migrate-mongo`.

## Running Migrations

### Apply All Pending Migrations
```bash
npx migrate-mongo up
```

### Rollback Last Migration
```bash
npx migrate-mongo down
```

### Check Migration Status
```bash
npx migrate-mongo status
```

### Create New Migration
```bash
npx migrate-mongo create <migration-name>
```

## Migration Files

### 20251124101410-track_add_playcount.js

**Purpose**: Add `playCount` field to all tracks for analytics and popularity tracking.

**What it does:**
1. Adds `playCount: 0` to all tracks that don't have the field
2. Ensures all existing tracks have a valid playCount (sets to 0 if null/undefined)
3. Creates an index on `playCount` field for performance (descending order)

**Up Migration:**
```bash
npx migrate-mongo up
```

**Down Migration (Rollback):**
```bash
npx migrate-mongo down
```
This will:
- Remove the `playCount` field from all tracks
- Drop the `playCount` index

**Schema Changes:**
```javascript
// Before
{
  id: "track123",
  name: "Song Name",
  // no playCount field
}

// After
{
  id: "track123",
  name: "Song Name",
  playCount: 0
}
```

**Usage After Migration:**
```typescript
// Increment play count
await TrackModel.findByIdAndUpdate(
  trackId,
  { $inc: { playCount: 1 } }
);

// Get most played tracks
const popular = await TrackModel
  .find()
  .sort({ playCount: -1 })
  .limit(50);

// Get track with play count
const track = await TrackModel.findById(trackId);
console.log(`Played ${track.playCount} times`);
```

## Migration Best Practices

### 1. Always Test Locally First
```bash
# Test up
npx migrate-mongo up

# Verify data
mongo <your-db> --eval "db.tracks.find().limit(5)"

# Test down (rollback)
npx migrate-mongo down

# Verify rollback worked
mongo <your-db> --eval "db.tracks.find().limit(5)"
```

### 2. Backup Before Running in Production
```bash
mongodump --uri="mongodb://..." --out=backup-$(date +%Y%m%d)
```

### 3. Check Migration Status Before Applying
```bash
npx migrate-mongo status
```

### 4. Monitor Performance
Large collections may take time:
- Use `updateMany` with appropriate filters
- Consider batching for very large collections
- Monitor database load during migration

### 5. Handle Errors Gracefully
- Migrations should be idempotent (can run multiple times safely)
- Use `$exists` checks to avoid duplicate operations
- Log progress for visibility

## Configuration

Migration configuration is in `migrate-mongo-config.js`:
```javascript
module.exports = {
  mongodb: {
    url: process.env.MONGO_URI || "mongodb://localhost:27017",
    databaseName: "edmhub",
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js"
};
```

## Migration Template

```javascript
module.exports = {
  async up(db, client) {
    console.log('Applying migration...');
    
    // Your migration code here
    const result = await db.collection('collection_name').updateMany(
      { /* filter */ },
      { $set: { /* updates */ } }
    );
    
    console.log(`Updated ${result.modifiedCount} documents`);
  },

  async down(db, client) {
    console.log('Rolling back migration...');
    
    // Rollback code here
    const result = await db.collection('collection_name').updateMany(
      { /* filter */ },
      { $unset: { /* fields to remove */ } }
    );
    
    console.log(`Rolled back ${result.modifiedCount} documents`);
  }
};
```

## Common Operations

### Add Field
```javascript
async up(db) {
  await db.collection('tracks').updateMany(
    { newField: { $exists: false } },
    { $set: { newField: defaultValue } }
  );
}
```

### Remove Field
```javascript
async down(db) {
  await db.collection('tracks').updateMany(
    {},
    { $unset: { fieldName: '' } }
  );
}
```

### Rename Field
```javascript
async up(db) {
  await db.collection('tracks').updateMany(
    {},
    { $rename: { oldName: 'newName' } }
  );
}
```

### Create Index
```javascript
async up(db) {
  await db.collection('tracks').createIndex({ fieldName: 1 });
}
```

### Drop Index
```javascript
async down(db) {
  await db.collection('tracks').dropIndex({ fieldName: 1 });
}
```

### Data Transformation
```javascript
async up(db) {
  const tracks = await db.collection('tracks').find({}).toArray();
  
  for (const track of tracks) {
    const transformed = transformData(track);
    await db.collection('tracks').updateOne(
      { _id: track._id },
      { $set: transformed }
    );
  }
}
```

## Troubleshooting

### Migration Failed
1. Check the error message
2. Verify database connection
3. Check migration syntax
4. Ensure database permissions
5. Rollback if needed: `npx migrate-mongo down`

### Migration Stuck
1. Check database logs
2. Look for locked collections
3. Check for long-running operations
4. Consider killing and rolling back

### Migration Applied But Not Working
1. Check migration code logic
2. Verify data with manual queries
3. Check indexes were created
4. Restart application to clear schema cache

## Production Deployment Checklist

- [ ] Test migration locally
- [ ] Test rollback locally
- [ ] Backup production database
- [ ] Schedule maintenance window (if needed)
- [ ] Run `migrate-mongo status` in production
- [ ] Apply migration: `npx migrate-mongo up`
- [ ] Verify data after migration
- [ ] Monitor application logs
- [ ] Test critical features
- [ ] Keep rollback plan ready

## Related Files

- **Config**: `/backend/migrate-mongo-config.js`
- **Schema**: `/backend/src/database/spotify/track.schema.ts`
- **Migrations**: `/backend/migrations/`

## Support

For issues with migrate-mongo:
- GitHub: https://github.com/seppevs/migrate-mongo
- Docs: https://github.com/seppevs/migrate-mongo#readme

