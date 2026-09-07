import 'dotenv/config';
import dotenv from 'dotenv';
import fs from 'fs';
import express from 'express';
import path from 'path';

// Clean up tsx synthetic __dirname so ESM modules (e.g. vite-plugin-pwa) properly resolve module root
try {
  delete (globalThis as any).__dirname;
  delete (global as any).__dirname;
} catch {
  // Ignore
}

// Hydrate environment variables from platform store (/app/.dev.env.json) if available
try {
  const devEnvPath = '/app/.dev.env.json';
  if (fs.existsSync(devEnvPath)) {
    const raw = fs.readFileSync(devEnvPath, 'utf8');
    const parsed = JSON.parse(raw);
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.trim()) {
        process.env[key] = value.trim();
      }
    }
  }
} catch {
  // Ignore
}

// Ensure telephony default variables are present
if (!process.env.TELEPHONY_PROVIDER) {
  process.env.TELEPHONY_PROVIDER = 'twilio';
}
if (!process.env.TWILIO_PHONE_NUMBER) {
  process.env.TWILIO_PHONE_NUMBER = '+17372508034';
}
import { createServer as createViteServer } from 'vite';
import {
  searchOfficialMandiPrices,
  searchOfficialMandiHistory,
  getMandiMetadata,
  getMandiComparison,
  handleVoiceMandiQuery,
} from './src/server/providers/agmarknetProvider';
import { gradeCropImage } from './src/server/geminiAiGrading';
import {
  processAiSupportChat,
  executeSupportDiagnostic,
  listSupportTickets,
  getSupportTicketById,
  createSupportTicket,
  updateSupportTicket,
  addMessageToTicket,
  submitTicketFeedback,
  processIncomingEmailSupport,
  processHelplineVoiceCall,
  SUPPORT_PHONE_NUMBER,
  SUPPORT_EMAIL,
  OFFICIAL_KISANSETU_HELPLINE_RAW,
} from './src/server/supportService';
import {
  getTwilioConfig,
  handleIncomingVoiceCall,
  handleSpeechGather,
  handleCallStatusCallback,
  getActiveCallSessionCount,
  validateTwilioWebhookRequest,
  getTwilioDiagnosticReport,
} from './src/server/twilioTelephonyService';
import {
  createFarmerAccount,
  createBuyerAccount,
  directUserLogin,
  getAuthenticatedUser,
  revokeSession,
  getFarmerProfileByUserId,
  updateFarmerProfileByUserId,
  getFarmerCrops,
  saveFarmerCrop,
  deleteFarmerCrop,
  getBuyerProfileByUserId,
  updateBuyerProfileByUserId,
  getBuyerOrders,
  addBuyerOrder,
  getBuyerRequirements,
  addBuyerRequirement,
  updateBuyerRequirementStatus,
  updateBuyerRequirement,
  getBuyerMessageThreads,
  addBuyerMessageToThread,
  getFarmerMessageThreads,
  addFarmerReplyToThread,
  getBuyerCart,
  setBuyerCart,
  getBuyerFavorites,
  setBuyerFavorites,
  toggleBuyerFavorite,
  getAllMarketplaceListings,
  getMarketplaceListingById,
  getPublicFarmerProfile,
  getMarketplaceFarmers,
  findFarmerUser,
  resolveCanonicalFarmerId,
  getFarmerProcessingRecords,
  createFarmerProcessingRecord,
  updateProcessingRecordStatus,
  publishProcessingRecordToMarketplace,
  getPostHarvestAnalytics,
} from './src/server/authService';
import {
  getLandVerificationByFarmer,
  submitOrUpdateLandVerification,
  getPropertiesByFarmer,
  saveOrUpdateFarmerProperty,
  deleteFarmerProperty,
} from './src/server/landVerificationService';
import { processFarmerRegistryDocument } from './src/server/farmerRegistryOcrService';
import {
  verifyAdminSession,
  getAdminOverviewStats,
  getAdminFarmers,
  getAdminFarmerDetails,
  updateFarmerVerification,
  getAdminBuyers,
  getAdminBuyerDetails,
  toggleUserSuspension,
  getAdminCropListings,
  toggleListingStatus,
  deleteListingPermanently,
  getAdminOrders,
  updateOrderStatus,
  getAdminEnquiries,
  getAdminPendingVerifications,
  getAdminMarketActivity,
  getAdminReportsData,
  getAdminAuditLogs,
} from './src/server/adminService';


dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ==========================================
// OFFICIAL AGMARKNET MANDI API ENDPOINTS
// ==========================================

// 1. Mandi Prices Search
app.get('/api/mandi-prices', async (req, res) => {
  try {
    const { state, district, market, commodity, variety, date, mode, limit } = req.query;
    const result = await searchOfficialMandiPrices({
      state: typeof state === 'string' ? state : undefined,
      district: typeof district === 'string' ? district : undefined,
      market: typeof market === 'string' ? market : undefined,
      commodity: typeof commodity === 'string' ? commodity : undefined,
      variety: typeof variety === 'string' ? variety : undefined,
      date: typeof date === 'string' ? date : undefined,
      mode: mode === 'demo' ? 'demo' : 'official',
      limit: limit ? parseInt(String(limit), 10) : 50,
    });
    res.json(result);
  } catch (error) {
    console.error('Error in /api/mandi-prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve official mandi prices from AGMARKNET source.',
    });
  }
});

// 1b. Mandi Prices History (Distinct Dates)
app.get('/api/mandi-prices/history', async (req, res) => {
  try {
    const { state, district, market, commodity, variety } = req.query;
    const result = await searchOfficialMandiHistory({
      state: typeof state === 'string' ? state : undefined,
      district: typeof district === 'string' ? district : undefined,
      market: typeof market === 'string' ? market : undefined,
      commodity: typeof commodity === 'string' ? commodity : undefined,
      variety: typeof variety === 'string' ? variety : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error in /api/mandi-prices/history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve official mandi price history from AGMARKNET source.',
    });
  }
});

// 2. Mandi Metadata (States, Districts, Mandis, Commodities)
app.get('/api/mandi-meta', (req, res) => {
  try {
    const meta = getMandiMetadata();
    res.json({ success: true, ...meta });
  } catch (error) {
    console.error('Error in /api/mandi-meta:', error);
    res.status(500).json({ success: false, error: 'Failed to load mandi metadata.' });
  }
});

// 3. Multi-Mandi Comparison
app.get('/api/mandi-compare', async (req, res) => {
  try {
    const commodity = typeof req.query.commodity === 'string' ? req.query.commodity : 'Tomato';
    const state = typeof req.query.state === 'string' ? req.query.state : 'Uttar Pradesh';
    const district = typeof req.query.district === 'string' ? req.query.district : undefined;

    const result = await getMandiComparison(commodity, state, district);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in /api/mandi-compare:', error);
    res.status(500).json({ success: false, error: 'Failed to compare mandi rates.' });
  }
});

// 4. Voice Query Processor for Mandi Rates
app.post('/api/mandi-voice-query', async (req, res) => {
  try {
    const { query, language } = req.body || {};
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query text is required.' });
    }
    const result = await handleVoiceMandiQuery(String(query), language === 'hi' ? 'hi' : 'en');
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in /api/mandi-voice-query:', error);
    res.status(500).json({ success: false, error: 'Failed to process voice mandi query.' });
  }
});

// 5. AI Crop Quality & Grading Endpoint
app.post('/api/ai/grade-crop', async (req, res) => {
  try {
    const { images, cropName, variety, category, language } = req.body || {};
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: language === 'hi' ? 'कृपया कम से कम 1 फसल फोटो प्रदान करें।' : 'Please provide at least 1 crop image.',
      });
    }
    const result = await gradeCropImage({
      images,
      cropName,
      variety,
      category,
      language: language === 'hi' ? 'hi' : 'en',
    });
    res.json(result);
  } catch (error) {
    console.error('Error in /api/ai/grade-crop:', error);
    res.status(500).json({
      success: false,
      error: 'AI crop grading failed.',
    });
  }
});

// ==========================================
// KISANSETU REAL AI SUPPORT & HELPLINE ROUTES
// ==========================================

// 6. Support System Configuration
app.get('/api/support/config', (req, res) => {
  res.json({
    success: true,
    phoneNumber: SUPPORT_PHONE_NUMBER,
    rawPhoneNumber: OFFICIAL_KISANSETU_HELPLINE_RAW,
    email: SUPPORT_EMAIL,
    isAiEnabled: Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY),
    channels: ['WEB_CHAT', 'PHONE', 'EMAIL', 'VOICE'],
  });
});

// 7. Real AI Support Chat Processor
app.post('/api/support/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], context = {} } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message text is required.' });
    }

    // Extract Bearer token from header or context
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const effectiveToken = bearerToken || context.token;

    const enrichedContext = {
      ...context,
      token: effectiveToken,
    };

    if (effectiveToken) {
      const sessionUser = getAuthenticatedUser(effectiveToken);
      if (sessionUser) {
        enrichedContext.userId = sessionUser.userId;
        enrichedContext.userRole = sessionUser.role;
        enrichedContext.userName = (sessionUser.profile as any)?.name || (sessionUser.user as any)?.name || enrichedContext.userName;
        enrichedContext.userPhone = sessionUser.mobileNumber || enrichedContext.userPhone;
        enrichedContext.userEmail = sessionUser.email || enrichedContext.userEmail;
      }
    }

    const result = await processAiSupportChat({
      message,
      conversationHistory,
      context: enrichedContext,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in /api/support/chat:', error);
    res.status(500).json({
      success: false,
      error: 'AI Support is temporarily unavailable.',
      replyText: 'AI Support is temporarily unavailable. You can create a direct support ticket or contact our helpline.',
      suggestedActions: [
        {
          id: 'err_ticket',
          label: 'Create Support Ticket',
          labelHi: 'सपोर्ट टिकट बनाएं',
          actionType: 'CREATE_TICKET',
        },
      ],
    });
  }
});

// 8. Real Issue Diagnostic Endpoint
app.post('/api/support/diagnose', async (req, res) => {
  try {
    const { query, context = {} } = req.body || {};
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query text is required for diagnosis.' });
    }
    const result = await executeSupportDiagnostic(String(query), context);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in /api/support/diagnose:', error);
    res.status(500).json({ success: false, error: 'Failed to run issue diagnosis.' });
  }
});

// 9. List Support Tickets (For user or admin)
app.get('/api/support/tickets', (req, res) => {
  try {
    const { userId, role, status, channel, category } = req.query;
    const tickets = listSupportTickets({
      userId: typeof userId === 'string' ? userId : undefined,
      role: typeof role === 'string' ? role : undefined,
      status: typeof status === 'string' ? status : undefined,
      channel: typeof channel === 'string' ? channel : undefined,
      category: typeof category === 'string' ? category : undefined,
    });
    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Error in /api/support/tickets GET:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve support tickets.' });
  }
});

// 10. Create Support Ticket
app.post('/api/support/tickets', (req, res) => {
  try {
    const {
      userId,
      userName,
      userRole,
      userPhone,
      userEmail,
      channel,
      category,
      subject,
      description,
      priority,
      status,
      initialMessage,
      language,
    } = req.body || {};

    const ticket = createSupportTicket({
      userId,
      userName,
      userRole,
      userPhone,
      userEmail,
      channel,
      category,
      subject,
      description,
      priority,
      status,
      initialMessage,
      language,
    });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error in /api/support/tickets POST:', error);
    res.status(500).json({ success: false, error: 'Failed to create support ticket.' });
  }
});

// 11. Get Single Ticket
app.get('/api/support/tickets/:id', (req, res) => {
  try {
    const ticket = getSupportTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Support ticket not found.' });
    }
    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error in /api/support/tickets/:id GET:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve ticket.' });
  }
});

// 12. Update Support Ticket (Status, Assignee, Priority)
app.patch('/api/support/tickets/:id', (req, res) => {
  try {
    const ticket = updateSupportTicket(req.params.id, req.body || {});
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Support ticket not found.' });
    }
    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error in /api/support/tickets/:id PATCH:', error);
    res.status(500).json({ success: false, error: 'Failed to update ticket.' });
  }
});

// 13. Add Reply to Ticket (User or Admin)
app.post('/api/support/tickets/:id/reply', (req, res) => {
  try {
    const { sender, senderName, text } = req.body || {};
    if (!text) {
      return res.status(400).json({ success: false, error: 'Reply text is required.' });
    }

    const ticket = addMessageToTicket(req.params.id, {
      sender: sender || 'user',
      senderName,
      text,
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Support ticket not found.' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error in /api/support/tickets/:id/reply:', error);
    res.status(500).json({ success: false, error: 'Failed to post reply.' });
  }
});

// 14. Submit Ticket Satisfaction Feedback
app.post('/api/support/tickets/:id/feedback', (req, res) => {
  try {
    const { rating, resolved, feedback } = req.body || {};
    const ticket = submitTicketFeedback(req.params.id, {
      rating,
      resolved: resolved || 'yes',
      feedback,
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Support ticket not found.' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error in /api/support/tickets/:id/feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to submit feedback.' });
  }
});

// 15. Email Support Webhook / Processing
app.post('/api/support/email-webhook', async (req, res) => {
  try {
    const { fromEmail, fromName, subject, body } = req.body || {};
    if (!fromEmail || !body) {
      return res.status(400).json({ success: false, error: 'fromEmail and body are required.' });
    }

    const result = await processIncomingEmailSupport({
      fromEmail,
      fromName,
      subject: subject || 'Support Request',
      body,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in /api/support/email-webhook:', error);
    res.status(500).json({ success: false, error: 'Failed to process support email.' });
  }
});

// 16. Phone Helpline Telephony / Voice Ingestion
app.post('/api/support/voice-call', async (req, res) => {
  try {
    const { callerPhone, callerName, speechTranscript, language } = req.body || {};
    if (!speechTranscript) {
      return res.status(400).json({ success: false, error: 'speechTranscript is required.' });
    }

    const result = await processHelplineVoiceCall({
      callerPhone,
      callerName,
      speechTranscript,
      language,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in /api/support/voice-call:', error);
    res.status(500).json({ success: false, error: 'Failed to process voice call.' });
  }
});

// ==========================================
// TWILIO TELEPHONY AI HELPLINE WEBHOOKS
// ==========================================

// 17. Telephony Provider Configuration Status (Safe, masked)
app.get('/api/support/twilio/config', async (req, res) => {
  try {
    const report = await getTwilioDiagnosticReport(req.get('host'));
    res.json(report);
  } catch (error) {
    console.error('Error in /api/support/twilio/config:', error);
    res.status(500).json({ success: false, error: 'Failed to read telephony status.' });
  }
});

// 17b. Detailed Telephony Diagnostics Report
app.get('/api/support/twilio/diagnostic', async (req, res) => {
  try {
    const report = await getTwilioDiagnosticReport(req.get('host'));
    res.json(report);
  } catch (error) {
    console.error('Error in /api/support/twilio/diagnostic:', error);
    res.status(500).json({ success: false, error: 'Failed to run telephony diagnostics.' });
  }
});

// 18. Twilio Incoming Voice Call Webhook (POST & GET)
app.all('/api/support/twilio/voice', async (req, res) => {
  try {
    const signature = req.headers['x-twilio-signature'] as string | undefined;
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const isValid = validateTwilioWebhookRequest(fullUrl, req.body || {}, signature);
    if (!isValid) {
      console.warn(`[KisanSetu Telephony] Warning: Webhook signature check mismatch for ${fullUrl}`);
    }

    const callSid = (req.body?.CallSid || req.query?.CallSid || `CALL_${Date.now()}`) as string;
    const from = (req.body?.From || req.query?.From || 'Unknown Caller') as string;
    const to = (req.body?.To || req.query?.To) as string;
    const callStatus = (req.body?.CallStatus || req.query?.CallStatus) as string;

    const twimlXml = await handleIncomingVoiceCall({
      callSid,
      from,
      to,
      callStatus,
    });

    res.type('text/xml');
    res.send(twimlXml);
  } catch (error) {
    console.error('Error in /api/support/twilio/voice:', error);
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">नमस्ते, किसानसेतु सहायता में आपका स्वागत है। तकनीकी व्यवधान के कारण कृपया पुनः प्रयास करें।</Say>
  <Hangup/>
</Response>`);
  }
});

// 19. Twilio Speech Gather Webhook (POST & GET)
app.all('/api/support/twilio/gather', async (req, res) => {
  try {
    const signature = req.headers['x-twilio-signature'] as string | undefined;
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const isValid = validateTwilioWebhookRequest(fullUrl, req.body || {}, signature);
    if (!isValid) {
      console.warn(`[KisanSetu Telephony] Warning: Webhook signature check mismatch for ${fullUrl}`);
    }

    const callSid = (req.body?.CallSid || req.query?.CallSid || `CALL_${Date.now()}`) as string;
    const from = (req.body?.From || req.query?.From || 'Unknown Caller') as string;
    const speechResult = (req.body?.SpeechResult || req.query?.SpeechResult || '') as string;
    const confidence = (req.body?.Confidence || req.query?.Confidence || '') as string;

    const twimlXml = await handleSpeechGather({
      callSid,
      from,
      speechResult,
      confidence,
    });

    res.type('text/xml');
    res.send(twimlXml);
  } catch (error) {
    console.error('Error in /api/support/twilio/gather:', error);
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">आपकी आवाज़ दर्ज कर ली गई है। हमारे विशेषज्ञ आपसे संपर्क करेंगे।</Say>
  <Hangup/>
</Response>`);
  }
});

// 20. Twilio Call Status Callback Webhook
app.post('/api/support/twilio/status', async (req, res) => {
  try {
    const callSid = (req.body?.CallSid || '') as string;
    const callStatus = (req.body?.CallStatus || '') as string;
    const callDuration = (req.body?.CallDuration || '') as string;
    const from = (req.body?.From || '') as string;

    if (callSid) {
      await handleCallStatusCallback({
        callSid,
        callStatus,
        callDuration,
        from,
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in /api/support/twilio/status:', error);
    res.status(200).send('OK');
  }
});

// 21. Telephony Interactive Simulation / Live Test Endpoint
app.post('/api/support/twilio/test-call', async (req, res) => {
  try {
    const { speechText, fromPhone, callSid = `SIM_${Date.now()}` } = req.body || {};

    if (!speechText) {
      // Step 1: Initial call test
      const twiml = await handleIncomingVoiceCall({
        callSid,
        from: fromPhone || '+91 98765 43210',
      });
      return res.json({ success: true, callSid, twiml });
    }

    // Step 2: Speech gather test
    const twiml = await handleSpeechGather({
      callSid,
      from: fromPhone || '+91 98765 43210',
      speechResult: speechText,
    });

    res.json({
      success: true,
      callSid,
      speechReceived: speechText,
      twiml,
    });
  } catch (error) {
    console.error('Error in /api/support/twilio/test-call:', error);
    res.status(500).json({ success: false, error: 'Telephony test call failed.' });
  }
});

// ==========================================
// KISANSETU AUTHENTICATION ROUTES (DIRECT PASSWORD-BASED)
// ==========================================

// 22. Farmer Signup (Password-based authentication)
app.post('/api/auth/farmer/signup', async (req, res) => {
  try {
    const {
      name,
      phone,
      password,
      fatherName,
      farmerId,
      district,
      tehsil,
      city,
      landAreaAcres,
      primaryCrops,
      farmerRegistryNumber,
      farmerRegistryDocumentUrl,
      farmerRegistryFileName,
      farmerRegistryOcrStatus,
      farmerRegistryVerificationStatus,
      farmerRegistryOcrData,
      farmerRegistrySubmittedAt,
    } = req.body || {};

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, and password are required.',
      });
    }

    const result = await createFarmerAccount({
      name,
      phone,
      password,
      email: req.body?.email,
      fatherName,
      farmerId,
      district,
      tehsil,
      city,
      landAreaAcres,
      primaryCrops,
      farmerRegistryNumber,
      farmerRegistryDocumentUrl,
      farmerRegistryFileName,
      farmerRegistryOcrStatus,
      farmerRegistryVerificationStatus,
      farmerRegistryOcrData,
      farmerRegistrySubmittedAt,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/auth/farmer/signup:', error);
    res.status(500).json({ success: false, message: 'Failed to create farmer account.' });
  }
});

// 23. Buyer Signup (Password-based authentication)
app.post('/api/auth/buyer/signup', async (req, res) => {
  try {
    const {
      name,
      mobile,
      password,
      profession,
      aadhaar,
      businessName,
      businessType,
      location,
      district,
      state,
      pincode,
    } = req.body || {};

    if (!name || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, mobile number, and password are required.',
      });
    }

    const result = await createBuyerAccount({
      name,
      mobile,
      password,
      email: req.body?.email,
      buyerId: req.body?.buyerId,
      profession,
      aadhaar,
      businessName,
      businessType,
      location,
      district,
      state,
      pincode,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/auth/buyer/signup:', error);
    res.status(500).json({ success: false, message: 'Failed to create buyer account.' });
  }
});

// 24. Unified Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { role, identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required.' });
    }
    const targetRole = role === 'buyer' ? 'buyer' : role === 'admin' ? 'admin' : 'farmer';
    const result = await directUserLogin(targetRole, String(identifier), String(password));
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// 26. Farmer Login (Direct password-based authentication without OTP)
app.post('/api/auth/farmer/login', async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Mobile/email and password are required.' });
    }

    const result = await directUserLogin('farmer', String(identifier), String(password));
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/auth/farmer/login:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// 27. Buyer Login (Simple normal authentication without OTP)
app.post('/api/auth/buyer/login', async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Mobile/email and password are required.' });
    }

    const result = await directUserLogin('buyer', String(identifier), String(password));
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/auth/buyer/login:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// 27a. Admin Login (Direct password-based authentication without OTP)
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
    }

    const result = await directUserLogin('admin', String(identifier), String(password));
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/auth/admin/login:', error);
    res.status(500).json({ success: false, message: 'Admin login failed. Please try again.' });
  }
});


// 27b. Current Authenticated User Session Verification
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7).trim();
    const userSession = getAuthenticatedUser(token);
    if (!userSession) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid or expired session token.' });
    }

    res.json({
      success: true,
      role: userSession.role,
      userId: userSession.userId,
      user: userSession.profile,
      profile: userSession.profile,
      mobileNumber: userSession.mobileNumber,
      email: userSession.email,
    });
  } catch (error: any) {
    console.error('Error in GET /api/auth/me:', error);
    res.status(500).json({ success: false, message: 'Failed to verify user session.' });
  }
});

// ==========================================
// FARMER LAND RECORD VERIFICATION ROUTES (UP BHULEKH / KHATAUNI)
// ==========================================

// Get Land Verification Details for Farmer
app.get('/api/farmer/land-verification/:farmerId', (req, res) => {
  try {
    const { farmerId } = req.params;
    const record = getLandVerificationByFarmer(farmerId);
    res.json({ success: true, record });
  } catch (error: any) {
    console.error('Error in /api/farmer/land-verification/:farmerId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch land verification.' });
  }
});

// Submit / Update Land Verification for Farmer
app.post('/api/farmer/land-verification', (req, res) => {
  try {
    const result = submitOrUpdateLandVerification(req.body || {});
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/farmer/land-verification:', error);
    res.status(500).json({ success: false, message: 'Failed to submit land verification.' });
  }
});

// ==========================================
// FARMER PROPERTY DETAILS (PROFILE MANAGEMENT)
// ==========================================

// Get All Properties for Authenticated Farmer
app.get('/api/farmer/properties/:farmerId', (req, res) => {
  try {
    const { farmerId } = req.params;
    const properties = getPropertiesByFarmer(farmerId);
    res.json({ success: true, properties });
  } catch (error: any) {
    console.error('Error in GET /api/farmer/properties/:farmerId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmer properties.' });
  }
});

// Save or Update Property for Authenticated Farmer
app.post('/api/farmer/properties', (req, res) => {
  try {
    const result = saveOrUpdateFarmerProperty(req.body || {});
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/farmer/properties:', error);
    res.status(500).json({ success: false, message: 'Failed to save property details.' });
  }
});

// Delete Property for Authenticated Farmer
app.delete('/api/farmer/properties/:farmerId/:propertyId', (req, res) => {
  try {
    const { farmerId, propertyId } = req.params;
    const success = deleteFarmerProperty(farmerId, propertyId);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Property not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error: any) {
    console.error('Error in DELETE /api/farmer/properties:', error);
    res.status(500).json({ success: false, message: 'Failed to delete property.' });
  }
});

// Process Farmer Registry Document Upload & OCR
app.post('/api/farmer/ocr-registry', async (req, res) => {
  try {
    const { documentBase64, fileName, fileSizeBytes, signupDetails, mimeType } = req.body || {};

    if (!documentBase64) {
      return res.status(400).json({
        success: false,
        validationStatus: 'UNREADABLE',
        statusTitle: 'दस्तावेज़ नहीं मिला',
        statusMessage: 'कृपया किसान रजिस्ट्री दस्तावेज़ अपलोड करें।',
        warningMessage: '⚠️ कृपया अपनी वास्तविक किसान रजिस्ट्री का दस्तावेज़ अपलोड करें।',
      });
    }

    const ocrResult = await processFarmerRegistryDocument(
      documentBase64,
      fileName || 'farmer_registry_document',
      Number(fileSizeBytes) || 1024,
      signupDetails || { name: '', district: '' },
      mimeType
    );

    res.json(ocrResult);
  } catch (error: any) {
    console.error('Error in POST /api/farmer/ocr-registry:', error);
    res.status(500).json({
      success: false,
      validationStatus: 'UNREADABLE',
      statusTitle: 'दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी',
      statusMessage: 'सर्वर पर दस्तावेज़ पढ़ने में त्रुटि हुई। कृपया दोबारा प्रयास करें।',
      warningMessage: '⚠️ दस्तावेज़ की जानकारी पढ़ी नहीं जा सकी। कृपया साफ़ दस्तावेज़ दोबारा अपलोड करें।',
    });
  }
});

// Logout endpoint to revoke session in central server store
app.post('/api/auth/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      revokeSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('Error in /api/auth/logout:', error);
    res.status(500).json({ success: false, message: 'Failed to logout.' });
  }
});

// 27b. Authenticated Farmer Profile Endpoint (Derives identity strictly from token/session)
app.get('/api/farmer/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'farmer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a farmer account.' });
    }
    const profile = getFarmerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Farmer profile record not found in database.' });
    }
    res.json({
      success: true,
      profile,
      user: profile,
      userId: userSession.userId,
      farmerId: profile.farmerId,
    });
  } catch (error: any) {
    console.error('Error in /api/farmer/profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmer profile.' });
  }
});

app.put('/api/farmer/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'farmer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a farmer account.' });
    }
    const updated = updateFarmerProfileByUserId(userSession.userId, req.body || {});
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Farmer profile record not found in database.' });
    }
    res.json({ success: true, profile: updated, user: updated });
  } catch (error: any) {
    console.error('Error in PUT /api/farmer/profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update farmer profile.' });
  }
});

// Farmer Crops Listings Persistence Endpoints
app.get('/api/farmer/crops', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.query.farmerId as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
      }
    }
    if (!farmerId) {
      return res.json({ success: true, crops: [], farmerId: '' });
    }
    const crops = getFarmerCrops(farmerId);
    res.json({ success: true, crops, farmerId });
  } catch (error: any) {
    console.error('Error in GET /api/farmer/crops:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch crops.' });
  }
});

app.post('/api/farmer/crops', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.body?.farmerId || req.body?.crop?.farmerId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
      }
    }
    if (!farmerId) {
      return res.status(401).json({ success: false, message: 'Authentication or farmerId is required.' });
    }
    const crop = req.body?.crop;
    if (!crop || !crop.id) {
      return res.status(400).json({ success: false, message: 'Crop listing data with id is required.' });
    }
    const saved = saveFarmerCrop(farmerId, crop);
    res.json({ success: true, crop: saved, farmerId: (saved as any)?.farmerId || farmerId });
  } catch (error: any) {
    console.error('Error in POST /api/farmer/crops:', error);
    res.status(500).json({ success: false, message: 'Failed to save crop listing.' });
  }
});

app.delete('/api/farmer/crops/:cropId', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = (req.query.farmerId as string) || (req.body?.farmerId as string);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
      }
    }
    if (!farmerId) {
      farmerId = 'KISAN-UP-2026-8842';
    }
    const { cropId } = req.params;
    const result = deleteFarmerCrop(farmerId, cropId);
    res.json({ success: true, message: result.message, farmerId, deletedCount: result.deletedCount });
  } catch (error: any) {
    console.error('Error in DELETE /api/farmer/crops/:cropId:', error);
    res.status(500).json({ success: false, message: 'Failed to delete crop listing.' });
  }
});

// ============================================================================
// POST-HARVEST PROCESSING & VALUE ADDITION ENDPOINTS
// ============================================================================

app.get('/api/farmer/processing-records', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.query.farmerId as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
      }
    }
    if (!farmerId) {
      farmerId = 'KISAN-UP-2026-8842'; // default fallback for demonstration session
    }
    const records = getFarmerProcessingRecords(farmerId);
    res.json({ success: true, records, farmerId });
  } catch (error: any) {
    console.error('Error in GET /api/farmer/processing-records:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch processing records.' });
  }
});

app.post('/api/farmer/processing-records', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.body?.farmerId;
    let farmerName = req.body?.farmerName;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
        if (profile?.name) farmerName = profile.name;
      }
    }
    if (!farmerId) {
      farmerId = 'KISAN-UP-2026-8842';
    }

    const payload = {
      ...req.body,
      farmerId,
      farmerName: farmerName || req.body?.farmerName || 'Rajesh Kumar',
    };

    const result = createFarmerProcessingRecord(farmerId, payload);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/farmer/processing-records:', error);
    res.status(500).json({ success: false, message: error?.message || 'Failed to create processing record.' });
  }
});

app.patch('/api/farmer/processing-records/:recordId/status', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.body?.farmerId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
      }
    }
    if (!farmerId) {
      farmerId = 'KISAN-UP-2026-8842';
    }
    const { recordId } = req.params;
    const { status, isPublishedToMarketplace, notes } = req.body || {};

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status field is required.' });
    }

    const updated = updateProcessingRecordStatus(farmerId, recordId, status, {
      isPublishedToMarketplace: Boolean(isPublishedToMarketplace),
      notes,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Processing record not found.' });
    }

    res.json({ success: true, record: updated });
  } catch (error: any) {
    console.error('Error in PATCH /api/farmer/processing-records/:recordId/status:', error);
    res.status(500).json({ success: false, message: 'Failed to update processing status.' });
  }
});

app.post('/api/farmer/processing-records/:recordId/publish', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.body?.farmerId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
      }
    }
    if (!farmerId) {
      farmerId = 'KISAN-UP-2026-8842';
    }
    const { recordId } = req.params;
    const customListing = req.body?.customListing;

    const result = publishProcessingRecordToMarketplace(farmerId, recordId, customListing);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/farmer/processing-records/:recordId/publish:', error);
    res.status(500).json({ success: false, message: 'Failed to publish to marketplace.' });
  }
});

app.get('/api/farmer/post-harvest-analytics', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.query.farmerId as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
        else if ((profile as any)?.id) farmerId = (profile as any).id;
      }
    }
    if (!farmerId) {
      farmerId = 'KISAN-UP-2026-8842';
    }
    const analytics = getPostHarvestAnalytics(farmerId);
    res.json({ success: true, analytics, farmerId });
  } catch (error: any) {
    console.error('Error in GET /api/farmer/post-harvest-analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post-harvest analytics.' });
  }
});

// ============================================================================
// REAL-TIME BUYER MARKETPLACE ENDPOINTS (READS FROM CENTRAL DATABASE)
// ============================================================================

app.get('/api/marketplace/listings', (req, res) => {
  try {
    const { crop, variety, district, category, status, search, farmerId, minPrice, maxPrice, sortBy, produceType } = req.query as any;
    const options: any = {};
    if (crop) options.crop = String(crop);
    if (variety) options.variety = String(variety);
    if (district) options.district = String(district);
    if (category) options.category = String(category);
    if (status) options.status = String(status);
    if (search) options.search = String(search);
    if (farmerId) options.farmerId = String(farmerId);
    if (minPrice) options.minPrice = Number(minPrice);
    if (maxPrice) options.maxPrice = Number(maxPrice);
    if (produceType) options.produceType = String(produceType);

    let listings = getAllMarketplaceListings(options);
    if (sortBy === 'lowestPrice' || sortBy === 'priceAsc') {
      listings.sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (sortBy === 'largestPrice' || sortBy === 'priceDesc') {
      listings.sort((a, b) => b.pricePerKg - a.pricePerKg);
    } else if (sortBy === 'recentlyAdded' || sortBy === 'newest') {
      listings.sort((a, b) => (b.createdTimestamp || 0) - (a.createdTimestamp || 0));
    }

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json({
      success: true,
      count: listings.length,
      listings,
      products: listings,
    });
  } catch (error: any) {
    console.error('Error in GET /api/marketplace/listings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch marketplace listings.' });
  }
});

app.get('/api/marketplace/listings/:listingId', (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = getMarketplaceListingById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Marketplace listing not found.' });
    }
    res.json({ success: true, listing, product: listing });
  } catch (error: any) {
    console.error('Error in GET /api/marketplace/listings/:listingId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch listing.' });
  }
});

app.get('/api/marketplace/farmers/:farmerId', (req, res) => {
  try {
    const { farmerId } = req.params;
    const farmer = getPublicFarmerProfile(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }
    res.json({ success: true, farmer });
  } catch (error: any) {
    console.error('Error in GET /api/marketplace/farmers/:farmerId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmer profile.' });
  }
});

app.get('/api/marketplace/farmers', (req, res) => {
  try {
    const farmers = getMarketplaceFarmers();
    res.json({ success: true, count: farmers.length, farmers });
  } catch (error: any) {
    console.error('Error in GET /api/marketplace/farmers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch marketplace farmers.' });
  }
});

// 27c. Authenticated Buyer Profile Endpoint (Derives identity strictly from token/session)
app.get('/api/buyer/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    res.json({
      success: true,
      profile,
      user: profile,
      userId: userSession.userId,
      buyerId: profile.id,
    });
  } catch (error: any) {
    console.error('Error in GET /api/buyer/profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch buyer profile.' });
  }
});

app.put('/api/buyer/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const updated = updateBuyerProfileByUserId(userSession.userId, req.body || {});
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    res.json({ success: true, profile: updated, user: updated });
  } catch (error: any) {
    console.error('Error in PUT /api/buyer/profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update buyer profile.' });
  }
});

// 27d. Authenticated Buyer Orders (Derives buyer identity strictly from token/session)
app.get('/api/buyer/orders', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const orders = getBuyerOrders(profile.id);
    res.json({ success: true, orders });
  } catch (error: any) {
    console.error('Error in GET /api/buyer/orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch buyer orders.' });
  }
});

app.post('/api/buyer/orders', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const orderData = req.body || {};
    // Ensure buyer identity is tied to authenticated session, never spoofable
    orderData.buyerId = profile.id;
    orderData.buyerName = profile.name;
    const newOrder = addBuyerOrder(profile.id, orderData);
    res.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Error in POST /api/buyer/orders:', error);
    res.status(500).json({ success: false, message: 'Failed to create buyer order.' });
  }
});

// 27e. Authenticated Buyer Requirements (Derives buyer identity strictly from token/session)
app.get('/api/buyer/requirements', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const requirements = getBuyerRequirements(profile.id);
    res.json({ success: true, requirements });
  } catch (error: any) {
    console.error('Error in GET /api/buyer/requirements:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch buyer requirements.' });
  }
});

app.post('/api/buyer/requirements', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const reqData = req.body || {};
    reqData.buyerId = profile.id;
    reqData.userId = profile.id;
    const createdReq = addBuyerRequirement(profile.id, reqData);
    res.json({ success: true, requirement: createdReq });
  } catch (error: any) {
    console.error('Error in POST /api/buyer/requirements:', error);
    res.status(500).json({ success: false, message: 'Failed to create requirement.' });
  }
});

app.put('/api/buyer/requirements/:id/status', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const { status } = req.body || {};
    const success = updateBuyerRequirementStatus(profile.id, req.params.id, status || 'Fulfilled');
    res.json({ success });
  } catch (error: any) {
    console.error('Error in PUT /api/buyer/requirements/:id/status:', error);
    res.status(500).json({ success: false, message: 'Failed to update requirement status.' });
  }
});

app.put('/api/buyer/requirements/:id', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const updated = updateBuyerRequirement(profile.id, req.params.id, req.body || {});
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Requirement not found.' });
    }
    res.json({ success: true, requirement: updated });
  } catch (error: any) {
    console.error('Error in PUT /api/buyer/requirements/:id:', error);
    res.status(500).json({ success: false, message: 'Failed to update requirement.' });
  }
});

// 27g. Authenticated Buyer Cart Persistence (One Database - Shared Web & Mobile)
app.get('/api/buyer/cart', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let buyerId = req.query.buyerId as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession) {
        const profile = getBuyerProfileByUserId(userSession.userId);
        if (profile) buyerId = profile.id;
      }
    }
    if (!buyerId) {
      return res.json({ success: true, cart: [] });
    }
    const cart = getBuyerCart(buyerId);
    res.json({ success: true, cart });
  } catch (error: any) {
    console.error('Error in GET /api/buyer/cart:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
  }
});

app.post('/api/buyer/cart', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let buyerId = req.body?.buyerId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession) {
        const profile = getBuyerProfileByUserId(userSession.userId);
        if (profile) buyerId = profile.id;
      }
    }
    if (!buyerId) {
      return res.status(400).json({ success: false, message: 'Buyer identifier is required.' });
    }
    const items = req.body?.items || req.body?.cart || [];
    const saved = setBuyerCart(buyerId, items);
    res.json({ success: true, cart: saved });
  } catch (error: any) {
    console.error('Error in POST /api/buyer/cart:', error);
    res.status(500).json({ success: false, message: 'Failed to save cart.' });
  }
});

// 27h. Authenticated Buyer Favorites Persistence (One Database - Shared Web & Mobile)
app.get('/api/buyer/favorites', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let buyerId = req.query.buyerId as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession) {
        const profile = getBuyerProfileByUserId(userSession.userId);
        if (profile) buyerId = profile.id;
      }
    }
    if (!buyerId) {
      return res.json({ success: true, favorites: [] });
    }
    const favorites = getBuyerFavorites(buyerId);
    res.json({ success: true, favorites });
  } catch (error: any) {
    console.error('Error in GET /api/buyer/favorites:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch favorites.' });
  }
});

app.post('/api/buyer/favorites', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let buyerId = req.body?.buyerId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession) {
        const profile = getBuyerProfileByUserId(userSession.userId);
        if (profile) buyerId = profile.id;
      }
    }
    if (!buyerId) {
      return res.status(400).json({ success: false, message: 'Buyer identifier is required.' });
    }
    const favorites = req.body?.favorites || req.body?.productIds || [];
    const saved = setBuyerFavorites(buyerId, favorites);
    res.json({ success: true, favorites: saved });
  } catch (error: any) {
    console.error('Error in POST /api/buyer/favorites:', error);
    res.status(500).json({ success: false, message: 'Failed to save favorites.' });
  }
});

app.post('/api/buyer/favorites/toggle', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let buyerId = req.body?.buyerId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession) {
        const profile = getBuyerProfileByUserId(userSession.userId);
        if (profile) buyerId = profile.id;
      }
    }
    const { productId } = req.body || {};
    if (!buyerId || !productId) {
      return res.status(400).json({ success: false, message: 'buyerId and productId are required.' });
    }
    const updated = toggleBuyerFavorite(buyerId, productId);
    res.json({ success: true, favorites: updated, isFavorite: updated.includes(productId) });
  } catch (error: any) {
    console.error('Error in POST /api/buyer/favorites/toggle:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle favorite.' });
  }
});

// 27i. Authenticated Farmer Messages & Replies (Real-time Cross-Platform Conversation Sync)
app.get('/api/farmer/messages', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.query.farmerId as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
      }
    }
    if (!farmerId) {
      return res.json({ success: true, threads: [] });
    }
    const threads = getFarmerMessageThreads(farmerId);
    res.json({ success: true, threads });
  } catch (error: any) {
    console.error('Error in GET /api/farmer/messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmer messages.' });
  }
});

app.post('/api/farmer/messages/reply', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let farmerId = req.body?.farmerId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const userSession = getAuthenticatedUser(token);
      if (userSession && userSession.role === 'farmer') {
        const profile = getFarmerProfileByUserId(userSession.userId);
        if (profile?.farmerId) farmerId = profile.farmerId;
      }
    }
    const { threadId, text } = req.body || {};
    if (!threadId || !text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'threadId and text are required.' });
    }
    const updatedThread = addFarmerReplyToThread(farmerId || 'KISAN-FARMER', threadId, text.trim());
    if (!updatedThread) {
      return res.status(404).json({ success: false, message: 'Message thread not found.' });
    }
    res.json({ success: true, thread: updatedThread });
  } catch (error: any) {
    console.error('Error in POST /api/farmer/messages/reply:', error);
    res.status(500).json({ success: false, message: 'Failed to reply to message.' });
  }
});

// 27j. Farmer Public Profile Endpoint (Direct Alias to /api/marketplace/farmers/:farmerId)
app.get('/api/farmer/public-profile/:farmerId', (req, res) => {
  try {
    const { farmerId } = req.params;
    const farmer = getPublicFarmerProfile(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }
    res.json({ success: true, farmer });
  } catch (error: any) {
    console.error('Error in GET /api/farmer/public-profile/:farmerId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmer profile.' });
  }
});

// 27f. Authenticated Buyer Messages (Derives buyer identity strictly from token/session)
app.get('/api/buyer/messages', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const threads = getBuyerMessageThreads(profile.id);
    res.json({ success: true, threads });
  } catch (error: any) {
    console.error('Error in GET /api/buyer/messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch buyer messages.' });
  }
});

app.post('/api/buyer/messages', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }
    const token = authHeader.slice(7);
    const userSession = getAuthenticatedUser(token);
    if (!userSession || userSession.role !== 'buyer') {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid session or not a buyer account.' });
    }
    const profile = getBuyerProfileByUserId(userSession.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Buyer profile record not found in database.' });
    }
    const { threadId, text, farmerId, cropContext, farmerName, farmerLocation } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty.' });
    }
    const thread = addBuyerMessageToThread(
      profile.id,
      threadId || `THR-${Date.now()}`,
      text.trim(),
      farmerId,
      cropContext,
      farmerName,
      farmerLocation
    );
    res.json({ success: true, thread });
  } catch (error: any) {
    console.error('Error in POST /api/buyer/messages:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// 28. Logout User
app.post('/api/auth/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      revokeSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('Error in /api/auth/logout:', error);
    res.json({ success: true });
  }
});

// 29. Auth Status Endpoint
app.get('/api/auth/config', (req, res) => {
  res.json({
    success: true,
    authProvider: 'direct_password',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KisanSetu Mandi Intelligence Engine',
    authProvider: 'Direct Password Authentication',
    timestamp: new Date().toISOString(),
  });
});

// Explicit Web App Manifest handler (serves both manifest.webmanifest and manifest.json)
app.get(['/manifest.webmanifest', '/manifest.json'], (req, res) => {
  const publicManifest = path.join(process.cwd(), 'public', 'manifest.webmanifest');
  const distManifest = path.join(process.cwd(), 'dist', 'manifest.webmanifest');
  
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  if (fs.existsSync(publicManifest)) {
    return res.sendFile(publicManifest);
  } else if (fs.existsSync(distManifest)) {
    return res.sendFile(distManifest);
  } else {
    res.json({
      id: '/',
      name: 'KisanSetu',
      short_name: 'KisanSetu',
      description: 'KisanSetu connects Indian farmers with trusted buyers, fair prices and AI-powered market intelligence.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#245C3A',
      background_color: '#FBFAF4',
      lang: 'hi-IN',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    });
  }
});

// ==========================================
// ADMIN CONTROL CENTER API ROUTES
// Protected by requireAdminAuth middleware
// ==========================================

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Admin session token required.' });
  }
  const token = authHeader.slice(7);
  if (!verifyAdminSession(token)) {
    return res.status(403).json({ success: false, message: 'Access denied. Valid Admin session required.' });
  }
  next();
}

// 1. Stats Overview
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  try {
    const stats = getAdminOverviewStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    console.error('Error in GET /api/admin/stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
});

// 2. Farmers List
app.get('/api/admin/farmers', requireAdminAuth, (req, res) => {
  try {
    const farmers = getAdminFarmers();
    res.json({ success: true, count: farmers.length, farmers });
  } catch (error: any) {
    console.error('Error in GET /api/admin/farmers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmers list.' });
  }
});

// 3. Farmer Details
app.get('/api/admin/farmers/:farmerId', requireAdminAuth, (req, res) => {
  try {
    const { farmerId } = req.params;
    const details = getAdminFarmerDetails(farmerId);
    if (!details) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }
    res.json({ success: true, ...details });
  } catch (error: any) {
    console.error('Error in GET /api/admin/farmers/:farmerId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmer details.' });
  }
});

// 4. Update Farmer Verification (Approve / Reject / Review)
app.post('/api/admin/farmers/:farmerId/verify', requireAdminAuth, (req, res) => {
  try {
    const { farmerId } = req.params;
    const { status, reason } = req.body || {};
    if (!status || !['VERIFIED', 'PENDING_REVIEW', 'REJECTED'].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Valid status required: VERIFIED, PENDING_REVIEW, or REJECTED' });
    }
    const result = updateFarmerVerification(farmerId, status, reason);
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/admin/farmers/:farmerId/verify:', error);
    res.status(500).json({ success: false, message: 'Failed to update farmer verification.' });
  }
});

// 5. Buyers List
app.get('/api/admin/buyers', requireAdminAuth, (req, res) => {
  try {
    const buyers = getAdminBuyers();
    res.json({ success: true, count: buyers.length, buyers });
  } catch (error: any) {
    console.error('Error in GET /api/admin/buyers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch buyers list.' });
  }
});

// 6. Buyer Details
app.get('/api/admin/buyers/:buyerId', requireAdminAuth, (req, res) => {
  try {
    const { buyerId } = req.params;
    const details = getAdminBuyerDetails(buyerId);
    if (!details) {
      return res.status(404).json({ success: false, message: 'Buyer not found.' });
    }
    res.json({ success: true, ...details });
  } catch (error: any) {
    console.error('Error in GET /api/admin/buyers/:buyerId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch buyer details.' });
  }
});

// 7. Toggle User Suspension
app.post('/api/admin/users/:userId/toggle-suspension', requireAdminAuth, (req, res) => {
  try {
    const { userId } = req.params;
    const { suspended } = req.body || {};
    const result = toggleUserSuspension(userId, Boolean(suspended));
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/admin/users/:userId/toggle-suspension:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle user suspension.' });
  }
});

// 8. Crop Listings
app.get('/api/admin/listings', requireAdminAuth, (req, res) => {
  try {
    const { crop, quality, status, search } = req.query;
    const listings = getAdminCropListings({
      crop: crop ? String(crop) : undefined,
      quality: quality ? String(quality) : undefined,
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined,
    });
    res.json({ success: true, count: listings.length, listings });
  } catch (error: any) {
    console.error('Error in GET /api/admin/listings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch crop listings.' });
  }
});

// 9. Toggle Listing Status
app.post('/api/admin/listings/:listingId/status', requireAdminAuth, (req, res) => {
  try {
    const { listingId } = req.params;
    const { status } = req.body || {};
    if (!status || !['Available', 'Sold', 'Disabled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status required: Available, Sold, or Disabled' });
    }
    const result = toggleListingStatus(listingId, status);
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/admin/listings/:listingId/status:', error);
    res.status(500).json({ success: false, message: 'Failed to update listing status.' });
  }
});

// 10. Delete Listing Permanently
app.delete('/api/admin/listings/:listingId', requireAdminAuth, (req, res) => {
  try {
    const { listingId } = req.params;
    const result = deleteListingPermanently(listingId);
    res.json(result);
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/listings/:listingId:', error);
    res.status(500).json({ success: false, message: 'Failed to delete listing.' });
  }
});

// 11. Orders
app.get('/api/admin/orders', requireAdminAuth, (req, res) => {
  try {
    const orders = getAdminOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    console.error('Error in GET /api/admin/orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

// 12. Update Order Status
app.post('/api/admin/orders/:orderId/status', requireAdminAuth, (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }
    const result = updateOrderStatus(orderId, status);
    res.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/admin/orders/:orderId/status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

// 13. Enquiries
app.get('/api/admin/enquiries', requireAdminAuth, (req, res) => {
  try {
    const enquiries = getAdminEnquiries();
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (error: any) {
    console.error('Error in GET /api/admin/enquiries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
});

// 14. Pending Verifications
app.get('/api/admin/verifications/pending', requireAdminAuth, (req, res) => {
  try {
    const verifications = getAdminPendingVerifications();
    res.json({ success: true, count: verifications.length, verifications });
  } catch (error: any) {
    console.error('Error in GET /api/admin/verifications/pending:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending verifications.' });
  }
});

// 15. Market Activity
app.get('/api/admin/activity', requireAdminAuth, (req, res) => {
  try {
    const activity = getAdminMarketActivity();
    res.json({ success: true, activity });
  } catch (error: any) {
    console.error('Error in GET /api/admin/activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch market activity.' });
  }
});

// 16. Reports Data
app.get('/api/admin/reports', requireAdminAuth, (req, res) => {
  try {
    const reports = getAdminReportsData();
    res.json({ success: true, reports });
  } catch (error: any) {
    console.error('Error in GET /api/admin/reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports data.' });
  }
});

// 17. Audit Logs
app.get('/api/admin/audit-logs', requireAdminAuth, (req, res) => {
  try {
    const logs = getAdminAuditLogs();
    res.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    console.error('Error in GET /api/admin/audit-logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
});

// ==========================================
// VITE CLIENT MIDDLEWARE & STATIC SERVING
// ==========================================
async function startServer() {
  // Catch-all for unmatched /api routes to prevent Vite from returning HTML on 404 API calls
  app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `API endpoint not found: ${req.method} ${req.path}` });
  });

  if (process.env.NODE_ENV !== 'production') {
    // Ensure DISABLE_HMR matches the sandbox preview constraint
    if (process.env.DISABLE_HMR === undefined) {
      process.env.DISABLE_HMR = 'true';
    }
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const { createLogger } = await import('vite');
    const baseLogger = createLogger();
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
        ws: isHmrDisabled ? false : undefined,
      },
      customLogger: {
        ...baseLogger,
        error(msg, opts) {
          if (
            typeof msg === 'string' &&
            (msg.includes('WebSocket') || msg.includes('ws error') || msg.includes('Port 24678') || msg.includes('[vite]'))
          ) {
            return;
          }
          baseLogger.error(msg, opts);
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KisanSetu] Mandi Engine Server running at http://0.0.0.0:${PORT}`);
    console.log(`[KisanSetu Auth] Direct Password Authentication active`);
  });
}

startServer().catch((err) => {
  console.error('[KisanSetu] Failed to start server:', err);
  process.exit(1);
});
