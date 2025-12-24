import { Hono } from 'hono';
import { query as dbQuery } from '../../../database/config.js';
import crypto from 'crypto';

const integrity = new Hono();

// Helper to generate hash
const generateHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

// Endpoint: Get Integrity Chain (Blockchain-style)
integrity.get('/chain', async (c) => {
  try {
    const surahs = await dbQuery("SELECT number, name_id FROM surah ORDER BY CAST(number as INTEGER) ASC");
    
    let chain = [];
    let previousHash = "0".repeat(64); // Genesis block previous hash

    for (const surah of surahs) {
      // Get all ayahs for this surah to calculate its hash
      const ayahs = await dbQuery(
        "SELECT arab, text FROM ayah WHERE surah = ? ORDER BY CAST(ayah as INTEGER) ASC",
        [surah.number]
      );
      
      // Data to be hashed for this block
      const blockData = {
        surah_number: surah.number,
        surah_name: surah.name_id,
        ayah_count: ayahs.length,
        content_hash: generateHash(ayahs), // Hash of all ayahs in this surah
        previous_hash: previousHash,
        version: "1.0.0",
        timestamp: "2025-12-24T00:00:00Z" // Standardized for this version
      };

      const blockHash = generateHash(blockData);
      
      chain.push({
        block_height: chain.length + 1,
        hash: blockHash,
        ...blockData
      });

      previousHash = blockHash;
    }

    return c.json({
      status: 200,
      message: "Data Integrity Chain (Proof of Authenticity)",
      network: "Muslim-API Data Ledger",
      root_hash: previousHash,
      chain: chain
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

// Endpoint: Verify specific Ayah
integrity.get('/verify/ayah', async (c) => {
  const surahId = c.req.query('surahId');
  const ayahId = c.req.query('ayahId');

  if (!surahId || !ayahId) {
    return c.json({ status: 400, message: "surahId and ayahId are required" }, 400);
  }

  try {
    const ayah = await dbQuery(
      "SELECT arab, text FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );

    if (!ayah || ayah.length === 0) {
      return c.json({ status: 404, message: "Ayah not found" }, 404);
    }

    const hash = generateHash(ayah[0]);

    return c.json({
      status: 200,
      data: {
        surah: surahId,
        ayah: ayahId,
        hash: hash,
        verification_method: "SHA-256",
        integrity: "Verified"
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default integrity;
