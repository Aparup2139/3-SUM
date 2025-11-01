// src/services/qrService.js
import dotenv from 'dotenv';
dotenv.config();

// The base URL for the QR code generation service provided in the image
const QR_API_BASE_URL = 'https://api.qrserver.com/v1/create-qr-code/';

/**
 * Generates the full URL for the QR code image based on the unique booking key.
 * This URL embeds the verification link for your backend.
 * * @param {string} qrCodeKey The unique key from the Booking document.
 * @returns {string} The complete URL of the QR code image.
 */
export const generateQrCodeUrl = (qrCodeKey) => {
    // The final link that the scanner will read:
    // e.g., https://your-domain.com/verification/bookId=A1B2C3D4...
    
    // IMPORTANT: Use your actual environment variable for the base URL
    const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:5000';
    
    const verificationLink = `${baseUrl}/verification/bookId/${qrCodeKey}`;
    
    // --- API Parameters for api.qrserver.com ---
    const params = new URLSearchParams();
    // Size: A good default size for a mobile scanner or printout
    params.append('size', '200x200'); 
    // Data: The verification link is the content of the QR code
    params.append('data', verificationLink); 
    
    // Construct the final URL for the QR image
    const qrCodeImageURL = `${QR_API_BASE_URL}?${params.toString()}`;
    
    return qrCodeImageURL;
};