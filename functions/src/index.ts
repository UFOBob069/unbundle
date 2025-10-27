import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin
admin.initializeApp()

const db = admin.firestore()

// Types
interface WaitlistEntry {
  email: string
  role: 'Investor' | 'Builder' | 'Trader' | 'Other'
  referrer?: string
  notes?: string
  createdAt: admin.firestore.Timestamp
  confirmed: boolean
  source: string
  ipHash?: string
  userAgent?: string
}

interface JoinWaitlistRequest {
  email: string
  role: 'Investor' | 'Builder' | 'Trader' | 'Other'
  referrer?: string
  notes?: string
  userAgent?: string
}

// Hash IP address for privacy
function hashIP(ip: string): string {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(ip).digest('hex')
}

// Join waitlist callable function
export const joinWaitlist = functions.https.onCall(async (data: JoinWaitlistRequest, context) => {
  try {
    // Validate input
    const email = data.email.toLowerCase().trim()
    if (!email || !data.role) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and role are required')
    }

    if (data.notes && data.notes.length > 280) {
      throw new functions.https.HttpsError('invalid-argument', 'Notes must be 280 characters or less')
    }

    // Get client IP (if available)
    let ipHash: string | undefined
    if (context.rawRequest.ip) {
      ipHash = hashIP(context.rawRequest.ip)
    }

    // Create waitlist entry
    const waitlistEntry: WaitlistEntry = {
      email,
      role: data.role,
      referrer: data.referrer?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      createdAt: admin.firestore.Timestamp.now(),
      confirmed: false,
      source: 'homepage',
      ipHash,
      userAgent: data.userAgent,
    }

    // Upsert to Firestore
    await db.collection('waitlist_entries').doc(email).set(waitlistEntry, { merge: true })

    // TODO: If DOUBLE_OPT_IN is enabled, send confirmation email
    const doubleOptIn = functions.config().app?.double_opt_in === 'true'
    if (doubleOptIn) {
      // TODO: Implement email confirmation logic with Resend or nodemailer
      console.log('Double opt-in enabled - email confirmation would be sent here')
    }

    return { success: true, message: 'Successfully joined waitlist' }
  } catch (error) {
    console.error('Error in joinWaitlist:', error)
    if (error instanceof functions.https.HttpsError) {
      throw error
    }
    throw new functions.https.HttpsError('internal', 'An error occurred while processing your request')
  }
})

// Confirm waitlist entry (for double opt-in)
export const confirmWaitlist = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.status(405).send('Method not allowed')
      return
    }

    const { token, email } = req.query

    if (!token || !email) {
      res.status(400).send('Missing token or email')
      return
    }

    // TODO: Verify the confirmation token
    // For now, just mark as confirmed
    await db.collection('waitlist_entries').doc(email as string).update({
      confirmed: true,
    })

    // Redirect to thanks page
    res.redirect('/thanks')
  } catch (error) {
    console.error('Error in confirmWaitlist:', error)
    res.status(500).send('Internal server error')
  }
})
