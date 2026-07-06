# CleanIndia REST API Specifications

Detailed documentation of backend endpoints.

## Authentication Endpoints

### 1. Request Signature Nonce
- **Endpoint**: `POST /api/auth/nonce`
- **Body**:
  ```json
  {
    "walletAddress": "0x71C249E9104033bF467c9c0F5486B2b347209B2a"
  }
  ```
- **Response**:
  ```json
  {
    "nonce": "748291",
    "message": "Sign this message to authenticate with Clean India: 748291"
  }
  ```

### 2. Verify Wallet Signature
- **Endpoint**: `POST /api/auth/verify`
- **Body**:
  ```json
  {
    "walletAddress": "0x71C249E9104033bF467c9c0F5486B2b347209B2a",
    "signature": "0x..."
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "60c72b2f9b1d8e2e28c46f1a",
      "walletAddress": "0x71c249e9104033bf467c9c0f5486b2b347209b2a",
      "username": "rohan"
    }
  }
  ```

## Reports Endpoints

### 1. Create Report
- **Endpoint**: `POST /api/reports`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "location": { "lat": 28.6139, "lng": 77.2090, "address": "Connaught Place, New Delhi" },
    "description": "Piles of plastic trash on secondary roads.",
    "wasteType": "PLASTIC",
    "severity": "HIGH",
    "imageData": "data:image/jpeg;base64,..."
  }
  ```

### 2. Get All Reports
- **Endpoint**: `GET /api/reports`
- **Query Params**: `page`, `limit`, `status`, `wasteType`, `severity`
- **Response**:
  ```json
  {
    "reports": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalReports": 54
    }
  }
  ```
