const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')
const crypto = require('crypto')

class DatabaseService {
  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'showdisplay.db')
    this.db = new Database(dbPath)
    this.initSchema()
  }

  initSchema() {
    // Create media_files table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS media_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('image', 'video', 'audio')),
        path TEXT NOT NULL UNIQUE,
        file_hash TEXT NOT NULL,
        size INTEGER NOT NULL,
        duration REAL,
        width INTEGER,
        height INTEGER,
        last_seen_at INTEGER,
        tags TEXT NOT NULL DEFAULT '[]',
        ext TEXT,
        thumbnail_path TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Create scenes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Create scene_sources table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scene_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scene_id INTEGER NOT NULL,
        media_id INTEGER,
        type TEXT NOT NULL CHECK(type IN ('text', 'timer', 'image', 'video')),
        x REAL NOT NULL DEFAULT 0,
        y REAL NOT NULL DEFAULT 0,
        width REAL NOT NULL DEFAULT 0.5,
        height REAL NOT NULL DEFAULT 0.5,
        rotation REAL NOT NULL DEFAULT 0,
        z_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        properties TEXT NOT NULL DEFAULT '{}',
        opacity REAL NOT NULL DEFAULT 1.0,
        volume REAL NOT NULL DEFAULT 1.0,
        is_muted INTEGER NOT NULL DEFAULT 0,
        start_ms INTEGER NOT NULL DEFAULT 0,
        end_ms INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
        FOREIGN KEY (media_id) REFERENCES media_files(id) ON DELETE SET NULL
      )
    `)

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_scene_sources_scene_id ON scene_sources(scene_id);
      CREATE INDEX IF NOT EXISTS idx_scene_sources_z_index ON scene_sources(scene_id, z_index);
      CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(type);
    `)

    console.log('Database initialized successfully')
  }

  // Media Files Methods
  addMediaFile(media) {
    const stmt = this.db.prepare(`
      INSERT INTO media_files (name, type, path, file_hash, size, duration, width, height, thumbnail_path, last_seen_at, tags, ext)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      media.name,
      media.type,
      media.path,
      media.file_hash,
      media.size,
      media.duration || null,
      media.width || null,
      media.height || null,
      media.thumbnail_path || null,
      Math.floor(Date.now() / 1000), // last_seen_at
      media.tags || '[]',
      media.ext || null
    )
    return result.lastInsertRowid
  }

  getMediaFiles(type = null) {
    let query = 'SELECT * FROM media_files'
    if (type) {
      query += ' WHERE type = ?'
      return this.db.prepare(query).all(type)
    }
    return this.db.prepare(query).all()
  }

  getMediaFileById(id) {
    return this.db.prepare('SELECT * FROM media_files WHERE id = ?').get(id)
  }

  deleteMediaFile(id) {
    return this.db.prepare('DELETE FROM media_files WHERE id = ?').run(id)
  }

  calculateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  // Scenes Methods
  createScene(name) {
    const stmt = this.db.prepare('INSERT INTO scenes (name) VALUES (?)')
    const result = stmt.run(name)
    return result.lastInsertRowid
  }

  getScenes() {
    return this.db.prepare('SELECT * FROM scenes ORDER BY created_at DESC').all()
  }

  getSceneById(id) {
    const scene = this.db.prepare('SELECT * FROM scenes WHERE id = ?').get(id)
    if (!scene) return null

    // Get all sources for this scene
    const sources = this.db.prepare(`
      SELECT ss.*, mf.path as media_path, mf.name as media_name, mf.type as media_type
      FROM scene_sources ss
      LEFT JOIN media_files mf ON ss.media_id = mf.id
      WHERE ss.scene_id = ?
      ORDER BY ss.z_index
    `).all(id)

    // Parse properties JSON for each source
    sources.forEach(source => {
      source.properties = JSON.parse(source.properties)
    })

    return {
      ...scene,
      sources
    }
  }

  updateScene(id, name) {
    const stmt = this.db.prepare(`
      UPDATE scenes
      SET name = ?, updated_at = strftime('%s', 'now')
      WHERE id = ?
    `)
    return stmt.run(name, id)
  }

  deleteScene(id) {
    return this.db.prepare('DELETE FROM scenes WHERE id = ?').run(id)
  }

  // Scene Sources Methods
  createSceneSource(sceneId, sourceData) {
    const stmt = this.db.prepare(`
      INSERT INTO scene_sources
      (scene_id, media_id, type, x, y, width, height, rotation, z_index, visible, properties)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      sceneId,
      sourceData.media_id || null,
      sourceData.type,
      sourceData.x || 0,
      sourceData.y || 0,
      sourceData.width || 0.5,
      sourceData.height || 0.5,
      sourceData.rotation || 0,
      sourceData.z_index || 0,
      sourceData.visible !== false ? 1 : 0,
      JSON.stringify(sourceData.properties || {})
    )
    return result.lastInsertRowid
  }

  updateSceneSource(id, sourceData) {
    const fields = []
    const values = []

    if (sourceData.x !== undefined) {
      fields.push('x = ?')
      values.push(sourceData.x)
    }
    if (sourceData.y !== undefined) {
      fields.push('y = ?')
      values.push(sourceData.y)
    }
    if (sourceData.width !== undefined) {
      fields.push('width = ?')
      values.push(sourceData.width)
    }
    if (sourceData.height !== undefined) {
      fields.push('height = ?')
      values.push(sourceData.height)
    }
    if (sourceData.rotation !== undefined) {
      fields.push('rotation = ?')
      values.push(sourceData.rotation)
    }
    if (sourceData.z_index !== undefined) {
      fields.push('z_index = ?')
      values.push(sourceData.z_index)
    }
    if (sourceData.visible !== undefined) {
      fields.push('visible = ?')
      values.push(sourceData.visible ? 1 : 0)
    }
    if (sourceData.properties !== undefined) {
      fields.push('properties = ?')
      values.push(JSON.stringify(sourceData.properties))
    }

    if (fields.length === 0) return

    fields.push("updated_at = strftime('%s', 'now')")
    values.push(id)

    const stmt = this.db.prepare(`
      UPDATE scene_sources
      SET ${fields.join(', ')}
      WHERE id = ?
    `)
    return stmt.run(...values)
  }

  deleteSceneSource(id) {
    return this.db.prepare('DELETE FROM scene_sources WHERE id = ?').run(id)
  }

  getSceneSources(sceneId) {
    const sources = this.db.prepare(`
      SELECT ss.*, mf.path as media_path, mf.name as media_name
      FROM scene_sources ss
      LEFT JOIN media_files mf ON ss.media_id = mf.id
      WHERE ss.scene_id = ?
      ORDER BY ss.z_index
    `).all(sceneId)

    sources.forEach(source => {
      source.properties = JSON.parse(source.properties)
    })

    return sources
  }

  close() {
    this.db.close()
  }
}

module.exports = DatabaseService
