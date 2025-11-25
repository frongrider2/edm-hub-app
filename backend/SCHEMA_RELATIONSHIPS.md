# Database Schema Relationships

## Overview
This document describes the MongoDB schema relationships for the EdmHub application, focusing on Playlist, User, and Track entities.

## Entity Relationships

```
┌─────────────┐          ┌──────────────┐          ┌─────────────┐
│    User     │◄─────────│   Playlist   │──────────►│    Track    │
│             │ createdBy│              │  tracks   │             │
└─────────────┘          └──────────────┘           └─────────────┘
      │                                                     │
      │                                                     │
      └─────────────────────────────────────────────────────┘
           favoritePlaylists            favoriteTracks
```

## Schemas

### 1. Playlist Schema (`playlist.schema.ts`)

#### Core Fields
- `name` (String, required): Playlist name
- `description` (String, optional): Playlist description
- `accentColor` (String, optional): UI accent color for the playlist
- `coverImageUrl` (String, optional): Cover image URL

#### Relationships
- `createdBy` (ObjectId → User, required, indexed): Creator/owner of the playlist
- `tracks` (Array<ObjectId → Track>, default: []): Tracks in the playlist

#### Metadata
- `isFavorite` (Boolean, default: false): Quick favorite flag
- `isPublic` (Boolean, default: true): Public/private visibility
- `tags` (Array<String>, default: []): Categorization tags
- `slug` (String, unique, sparse, indexed): URL-friendly identifier

#### Analytics
- `playCount` (Number, default: 0): Number of times played
- `lastPlayedAt` (Date, optional): Last play timestamp
- `totalDuration` (Number, default: 0): Total duration in milliseconds

#### System Fields
- `deletedAt` (Date, optional): Soft delete timestamp
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last update timestamp

#### Indexes
```typescript
{ createdBy: 1, createdAt: -1 }         // User's playlists sorted by date
{ createdBy: 1, isFavorite: 1 }         // User's favorite playlists
{ isPublic: 1, createdAt: -1 }          // Public playlists discovery
{ tags: 1 }                              // Search by tags
{ slug: 1 }                              // Unique slug lookup
```

### 2. User Schema (`user.schema.ts`)

#### Authentication
- `googleId` (String, optional): Google OAuth ID
- `email` (String, optional): User email
- `password` (String, optional): Hashed password
- `isEmailVerified` (Boolean, default: false): Email verification status

#### Profile
- `name` (String, default: ''): Display name
- `picture` (String, default: ''): Profile picture URL
- `role` (Enum: UserRole, default: USER): User role

#### Relationships
- `favoritePlaylists` (Array<ObjectId → Playlist>, default: [], indexed): Favorited playlists
- `favoriteTracks` (Array<ObjectId → Track>, default: [], indexed): Favorited tracks

#### System Fields
- `isEnabled` (Boolean, default: true): Account active status
- `deletedAt` (Date, optional): Soft delete timestamp
- `createdAt` (Date, auto): Registration timestamp
- `updatedAt` (Date, auto): Last update timestamp

#### Indexes
```typescript
{ favoritePlaylists: 1 }                // Quick favorite playlist lookup
{ favoriteTracks: 1 }                   // Quick favorite track lookup
```

### 3. Track Schema (`track.schema.ts`)

#### Core Fields
- `id` (String, required, unique, indexed): Spotify track ID
- `name` (String, required): Track name
- `duration_ms` (Number): Duration in milliseconds
- `preview_url` (String): Preview audio URL

#### Relationships
- `artists` (Array<TrackArtist>): Embedded artist information
- `artistRefs` (Array<ObjectId → Artist>): Artist references
- `albumRef` (ObjectId → Album): Album reference

#### Spotify Data
- `external_urls` (ExternalUrls): Spotify URLs
- `explicit` (Boolean): Explicit content flag
- `is_playable` (Boolean): Playability status
- `available_markets` (Array<String>): Available markets
- `track_number` (Number): Track number in album
- `disc_number` (Number): Disc number

#### System Fields
- `deletedAt` (Date, optional): Soft delete timestamp
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last update timestamp

## Relationship Details

### User → Playlist (One-to-Many)
- **Type**: Creator relationship
- **Field**: `Playlist.createdBy` → `User._id`
- **Cardinality**: One user can create many playlists
- **Cascade**: Consider soft delete (set `deletedAt`) or transfer ownership
- **Query Example**:
  ```typescript
  // Get all playlists created by a user
  await PlaylistModel.find({ createdBy: userId });
  ```

### Playlist → Track (Many-to-Many)
- **Type**: Contains relationship
- **Field**: `Playlist.tracks` → `Track._id[]`
- **Cardinality**: One playlist can have many tracks, one track can be in many playlists
- **Order**: Array order represents playlist track order
- **Query Example**:
  ```typescript
  // Get playlist with populated tracks
  await PlaylistModel.findById(playlistId).populate('tracks');
  ```

### User → Playlist (Many-to-Many via Favorites)
- **Type**: Favorite relationship
- **Field**: `User.favoritePlaylists` → `Playlist._id[]`
- **Cardinality**: User can favorite many playlists, playlist can be favorited by many users
- **Query Example**:
  ```typescript
  // Get user's favorite playlists
  await UserModel.findById(userId).populate('favoritePlaylists');
  ```

### User → Track (Many-to-Many via Favorites)
- **Type**: Favorite relationship
- **Field**: `User.favoriteTracks` → `Track._id[]`
- **Cardinality**: User can favorite many tracks, track can be favorited by many users
- **Query Example**:
  ```typescript
  // Get user's favorite tracks
  await UserModel.findById(userId).populate('favoriteTracks');
  ```

## Common Queries

### 1. Get User's Playlists with Track Count
```typescript
const playlists = await PlaylistModel.aggregate([
  { $match: { createdBy: userId } },
  { $project: {
    name: 1,
    description: 1,
    trackCount: { $size: '$tracks' },
    createdAt: 1
  }},
  { $sort: { createdAt: -1 } }
]);
```

### 2. Get Playlist with Full Track Details
```typescript
const playlist = await PlaylistModel
  .findById(playlistId)
  .populate({
    path: 'tracks',
    select: 'name artists duration_ms preview_url'
  })
  .populate({
    path: 'createdBy',
    select: 'name picture'
  });
```

### 3. Add Track to Playlist
```typescript
await PlaylistModel.findByIdAndUpdate(
  playlistId,
  { 
    $addToSet: { tracks: trackId },
    $inc: { totalDuration: trackDuration }
  },
  { new: true }
);
```

### 4. Toggle Favorite Playlist
```typescript
// Add to favorites
await UserModel.findByIdAndUpdate(
  userId,
  { $addToSet: { favoritePlaylists: playlistId } }
);

// Remove from favorites
await UserModel.findByIdAndUpdate(
  userId,
  { $pull: { favoritePlaylists: playlistId } }
);
```

### 5. Get Public Playlists with Creator Info
```typescript
const publicPlaylists = await PlaylistModel
  .find({ isPublic: true, deletedAt: null })
  .populate('createdBy', 'name picture')
  .sort({ createdAt: -1 })
  .limit(20);
```

### 6. Search Playlists by Tag
```typescript
const playlists = await PlaylistModel
  .find({ 
    tags: { $in: ['edm', 'techno'] },
    isPublic: true 
  })
  .populate('createdBy', 'name');
```

## Performance Considerations

### Indexes
All critical query paths are indexed:
- User's playlists: `{ createdBy: 1, createdAt: -1 }`
- Public playlist discovery: `{ isPublic: 1, createdAt: -1 }`
- Favorite lookups: `{ favoritePlaylists: 1 }`, `{ favoriteTracks: 1 }`
- Slug lookups: `{ slug: 1 }`

### Embedding vs. Referencing
- **Embedded**: Track artist info (frequently accessed together)
- **Referenced**: Playlist tracks (many-to-many relationship)
- **Referenced**: User favorites (many-to-many relationship)

### Denormalization
Consider denormalizing for performance:
- Cache track count in playlist
- Cache total duration in playlist
- Cache favorite count in playlist/track

## Migration Notes

### From Frontend State to Backend Schema
The frontend Redux state uses simplified fields:
```typescript
// Frontend (simplified)
interface Playlist {
  id: string;
  name: string;
  description?: string;
  songIds: string[];      // Simple string array
  isFavorite?: boolean;
  accentColor?: string;
}

// Backend (rich relations)
class Playlist {
  createdBy: ObjectId;     // User reference
  tracks: ObjectId[];      // Track references
  favoritePlaylists: []    // Now on User schema
  // + additional metadata
}
```

### Data Sync Strategy
1. Use playlist `_id` as frontend `id`
2. Map `tracks` ObjectIds to frontend `songIds`
3. User-specific favorites come from `User.favoritePlaylists`
4. Populate relations when sending to frontend

## Security Considerations

### Access Control
- Users can only modify their own playlists (`createdBy`)
- Public playlists are read-only for non-owners
- Favorites are user-specific
- Soft delete preserves data integrity

### Validation
- Required fields: `name`, `createdBy`
- Unique constraint: `slug`
- Array validation: Ensure valid ObjectIds in `tracks`, `favoritePlaylists`, `favoriteTracks`

## Future Enhancements

1. **Collaborative Playlists**: Add `collaborators: ObjectId[]`
2. **Playlist Sharing**: Add `sharedWith: ObjectId[]`
3. **Play History**: Create separate `PlayHistory` schema
4. **Playlist Analytics**: Track plays, skips, favorites over time
5. **Smart Playlists**: Add query-based dynamic playlists
6. **Playlist Versioning**: Track changes over time

