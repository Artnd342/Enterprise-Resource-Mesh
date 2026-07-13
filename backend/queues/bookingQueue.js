const { Queue, Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const pool = require('../config/db');

const bookingQueue = new Queue('bookingReservationQueue', { connection: redisConnection });

const bookingWorker = new Worker('bookingReservationQueue', async (job) => {
  const { userId, resourceId, startTime, endTime } = job.data;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Fetch resource state with Row-Level Locking
    const resourceRes = await client.query(
      'SELECT is_available FROM resources WHERE id = $1 FOR UPDATE',
      [resourceId]
    );

    if (resourceRes.rows.length === 0) throw new Error('Resource does not exist.');
    if (!resourceRes.rows[0].is_available) throw new Error('Resource already claimed.');

    // Check for schedule overlaps
    const overlappingRes = await client.query(
      `SELECT id FROM bookings WHERE resource_id = $1 AND NOT (end_time <= $2 OR start_time >= $3)`,
      [resourceId, startTime, endTime]
    );
    if (overlappingRes.rows.length > 0) throw new Error('Time window conflicts.');

    // Insert reservation
    await client.query(
      'INSERT INTO bookings (user_id, resource_id, start_time, end_time) VALUES ($1, $2, $3, $4)',
      [userId, resourceId, startTime, endTime]
    );

    // Update resource status
    await client.query('UPDATE resources SET is_available = FALSE WHERE id = $1', [resourceId]);

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}, { connection: redisConnection });

module.exports = { bookingQueue };