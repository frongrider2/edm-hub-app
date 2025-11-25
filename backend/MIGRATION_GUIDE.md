# PlayCount Migration Guide

## Overview
This guide explains the playCount field addition to the Track schema and how to use the migration.

## What Changed

### Track Schema Updates

**File**: `/backend/src/database/spotify/track.schema.ts`

Added `playCount` field:
```typescript
@Prop({ type: Number, default: 0 })
playCount: number;
```

Added indexes for performance:
```typescript
TrackSchema.index({ playCount: -1 }); // For sorting by popularity
TrackSchema.index({ artistRefs: 1 }); // For artist's tracks queries
TrackSchema.index({ albumRef: 1 }); // For album's tracks queries
```

### Migration File

**File**: `/backend/migrations/20251124101410-track_add_playcount.js`

The migration:
1. ✅ Adds `playCount: 0` to all tracks without the field
2. ✅ Ensures all tracks have valid playCount (sets to 0 if null)
3. ✅ Creates descending index on playCount
4. ✅ Supports rollback (removes field and index)

## Running the Migration

### Option 1: Using Makefile (Recommended)

```bash
# Check current migration status
make migrate-status

# Apply the migration
make migrate-up

# If needed, rollback
make migrate-down
```

### Option 2: Using npx directly

```bash
# Check status
npx migrate-mongo status

# Apply migration
npx migrate-mongo up

# Rollback if needed
npx migrate-mongo down
```

## Expected Output

When running `make migrate-up`:

```
Adding playCount field to all tracks...
Updated 150 tracks with playCount field
Ensured 150 tracks have valid playCount
Created index on playCount field
✓ Migrations applied successfully
```

## Verification

### Check if migration was applied

```bash
# Using Makefile
make migrate-status

# Should show:
# APPLIED   20251124101410-track_add_playcount.js
```

### Verify in MongoDB

```javascript
// Connect to MongoDB
mongo mongodb://localhost:27017/edmhub

// Check a few tracks
db.tracks.find().limit(5).pretty()

// Expected output:
{
  "_id": ObjectId("..."),
  "id": "track123",
  "name": "Song Name",
  "playCount": 0,  // ← New field!
  // ... other fields
}

// Verify index exists
db.tracks.getIndexes()

// Should include:
{
  "v": 2,
  "key": { "playCount": -1 },
  "name": "playCount_-1"
}
```

## Using PlayCount in Your Code

### 1. Increment Play Count

```typescript
import { TrackModel } from './database/spotify/track.schema';

// When a track is played
async function trackPlayed(trackId: string) {
  await TrackModel.findByIdAndUpdate(
    trackId,
    { $inc: { playCount: 1 } },
    { new: true }
  );
}
```

### 2. Get Most Popular Tracks

```typescript
// Get top 50 most played tracks
async function getMostPopular(limit = 50) {
  return await TrackModel
    .find({ deletedAt: null })
    .sort({ playCount: -1 })
    .limit(limit)
    .populate('artistRefs')
    .populate('albumRef');
}
```

### 3. Get Track with Play Stats

```typescript
async function getTrackStats(trackId: string) {
  const track = await TrackModel.findById(trackId);
  
  return {
    id: track.id,
    name: track.name,
    playCount: track.playCount,
    popularityScore: calculatePopularity(track.playCount)
  };
}
```

### 4. Artist's Most Popular Tracks

```typescript
async function getArtistPopularTracks(artistId: string, limit = 10) {
  return await TrackModel
    .find({ artistRefs: artistId, deletedAt: null })
    .sort({ playCount: -1 })
    .limit(limit);
}
```

### 5. Analytics Dashboard

```typescript
async function getPlayStats() {
  const stats = await TrackModel.aggregate([
    { $match: { deletedAt: null } },
    { $group: {
      _id: null,
      totalPlays: { $sum: '$playCount' },
      avgPlays: { $avg: '$playCount' },
      maxPlays: { $max: '$playCount' },
      tracksWithPlays: {
        $sum: { $cond: [{ $gt: ['$playCount', 0] }, 1, 0] }
      }
    }}
  ]);
  
  return stats[0];
}
```

## API Endpoint Examples

### Track Controller Updates

```typescript
import { Controller, Get, Param, Post } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get('popular')
  async getPopular() {
    return this.trackService.getMostPopular(50);
  }

  @Get(':id')
  async getTrack(@Param('id') id: string) {
    return this.trackService.getTrackWithStats(id);
  }

  @Post(':id/play')
  async recordPlay(@Param('id') id: string) {
    await this.trackService.incrementPlayCount(id);
    return { message: 'Play recorded' };
  }

  @Get('artist/:artistId/popular')
  async getArtistPopular(@Param('artistId') artistId: string) {
    return this.trackService.getArtistPopularTracks(artistId, 10);
  }
}
```

### Track Service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './database/spotify/track.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>
  ) {}

  async incrementPlayCount(trackId: string): Promise<void> {
    await this.trackModel.findOneAndUpdate(
      { id: trackId },
      { $inc: { playCount: 1 } }
    );
  }

  async getMostPopular(limit: number): Promise<Track[]> {
    return this.trackModel
      .find({ deletedAt: null })
      .sort({ playCount: -1 })
      .limit(limit)
      .populate('artistRefs')
      .exec();
  }

  async getTrackWithStats(trackId: string): Promise<Track> {
    return this.trackModel
      .findOne({ id: trackId })
      .populate('artistRefs')
      .populate('albumRef')
      .exec();
  }

  async getArtistPopularTracks(artistId: string, limit: number): Promise<Track[]> {
    return this.trackModel
      .find({ artistRefs: artistId, deletedAt: null })
      .sort({ playCount: -1 })
      .limit(limit)
      .exec();
  }
}
```

## Performance Considerations

### Indexing Strategy

The migration creates these indexes:
1. `{ playCount: -1 }` - For sorting popular tracks (descending)
2. `{ artistRefs: 1 }` - For finding artist's tracks
3. `{ albumRef: 1 }` - For finding album's tracks

### Query Optimization

```typescript
// ✅ Good - Uses index
await TrackModel.find().sort({ playCount: -1 }).limit(50);

// ✅ Good - Composite query with index
await TrackModel
  .find({ artistRefs: artistId })
  .sort({ playCount: -1 });

// ⚠️ Consider pagination for large results
await TrackModel
  .find()
  .sort({ playCount: -1 })
  .skip(page * limit)
  .limit(limit);
```

### Caching Popular Tracks

For high-traffic apps, consider caching:

```typescript
import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getMostPopular(limit: number): Promise<Track[]> {
    const cacheKey = `popular_tracks_${limit}`;
    
    // Try cache first
    let tracks = await this.cacheManager.get<Track[]>(cacheKey);
    
    if (!tracks) {
      // Query database
      tracks = await this.trackModel
        .find({ deletedAt: null })
        .sort({ playCount: -1 })
        .limit(limit)
        .exec();
      
      // Cache for 5 minutes
      await this.cacheManager.set(cacheKey, tracks, 300);
    }
    
    return tracks;
  }
}
```

## Rollback Instructions

If you need to remove the playCount field:

```bash
# Using Makefile
make migrate-down

# Or using npx
npx migrate-mongo down
```

This will:
- Remove `playCount` field from all tracks
- Drop the `playCount` index

## Troubleshooting

### Migration Shows "Already Applied"

```bash
# Check status
make migrate-status

# If already applied, you're good!
# To re-apply, first rollback:
make migrate-down
make migrate-up
```

### Tracks Still Have No PlayCount

```javascript
// Manual fix in MongoDB
db.tracks.updateMany(
  { playCount: { $exists: false } },
  { $set: { playCount: 0 } }
)
```

### Index Not Created

```javascript
// Manually create index
db.tracks.createIndex({ playCount: -1 })
db.tracks.createIndex({ artistRefs: 1 })
db.tracks.createIndex({ albumRef: 1 })
```

### Performance Issues After Migration

1. Check index usage:
```javascript
db.tracks.find().sort({ playCount: -1 }).explain("executionStats")
```

2. Verify indexes exist:
```javascript
db.tracks.getIndexes()
```

3. Consider index warming:
```javascript
// Force index into memory
db.tracks.find().sort({ playCount: -1 }).limit(100).toArray()
```

## Testing the Migration

### Pre-Migration Checklist
- [ ] Backup database
- [ ] Test migration locally
- [ ] Verify rollback works
- [ ] Check application starts
- [ ] Test playCount queries

### Post-Migration Verification
- [ ] All tracks have playCount field
- [ ] Index exists and is used
- [ ] API endpoints work
- [ ] Popular tracks query is fast
- [ ] No application errors

## Production Deployment

1. **Backup database**
   ```bash
   make db-backup
   ```

2. **Apply migration during maintenance window**
   ```bash
   make migrate-up
   ```

3. **Verify migration**
   ```bash
   make migrate-status
   ```

4. **Deploy updated application**
   ```bash
   make build
   make start
   ```

5. **Monitor logs and performance**
   ```bash
   make logs
   ```

## Related Files

- **Migration**: `/backend/migrations/20251124101410-track_add_playcount.js`
- **Schema**: `/backend/src/database/spotify/track.schema.ts`
- **Config**: `/backend/migrate-mongo-config.js`
- **Makefile**: `/backend/Makefile`
- **Docs**: `/backend/migrations/README.md`

## Support

For issues or questions:
1. Check migration logs
2. Review this guide
3. Check `/backend/migrations/README.md`
4. Verify MongoDB connection
5. Check application logs

## Summary

✅ **Added**: `playCount` field to Track schema  
✅ **Added**: Indexes for performance  
✅ **Created**: Migration with rollback support  
✅ **Updated**: Makefile with migration commands  
✅ **Documented**: Usage examples and best practices

**Next Steps**:
1. Run migration: `make migrate-up`
2. Implement play tracking in your app
3. Use popular tracks queries
4. Monitor performance

