# 🏛️ Land Record Management System

A blockchain-powered workflow system for secure, tamper-proof land records using **Hyperledger Fabric**, **Node.js**, **Django**, and **IPFS (Pinata)**. The platform creates immutable land data, tracks approval workflow, and stores documents securely off-chain.

---

## 📌 Features

- 🔐 Blockchain-secured land record lifecycle
- 📜 Immutable request & workflow history
- 🗃️ IPFS-based decentralized document storage
- 🌐 Node.js RESTful API integrated with Fabric SDK
- 🖥️ Django-powered web application for users & officials
- 👮 Role-based approval workflow (Clerk → Superintendent → Final Approval)

---

## 📁 Project Structure

```

fabric-land-record/
│
├── fabric-samples/                # Hyperledger Fabric binaries & test network
├── fabric-api/                    # Node.js backend + Fabric API
│   ├── api.js
│   ├── setup.sh
│   └── package.json
│
└── myproject/                     # Django Frontend Web App
├── manage.py
├── requirements.txt
└── .env                       # (to be created manually)

````

---

## ⚙️ Prerequisites

Ensure the following are installed:

- Docker & Docker Compose  
- Node.js 14+  
- Python 3.8+  
- Git  
- jq (optional but useful)

---

# 🚀 Setup Instructions

## 1️⃣ Backend — Blockchain & Fabric API

### Step 1: Start Hyperledger Network
```bash
source network_up.sh
````

### Step 2: Move to API Directory

```bash
cd ../..
cd fabric-api
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Edit `setup.sh` and add these lines

```bash
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/Users/saurabhkumar/Documents/fabric-land-record/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/Users/saurabhkumar/Documents/fabric-land-record/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export FABRIC_CFG_PATH=/Users/saurabhkumar/Documents/fabric-land-record/config
```

| Variable                      | Description                             |
| ----------------------------- | --------------------------------------- |
| `CORE_PEER_LOCALMSPID`        | Sets active organization (Org1)         |
| `CORE_PEER_TLS_ROOTCERT_FILE` | Peer TLS certificate path               |
| `CORE_PEER_MSPCONFIGPATH`     | Admin identity for signing transactions |
| `CORE_PEER_ADDRESS`           | Peer endpoint                           |
| `FABRIC_CFG_PATH`             | Fabric config directory                 |

### Step 5: Make File Executable

```bash
chmod +x setup.sh
```

### Step 6: Load Variables

```bash
source setup.sh
```

### Step 7: Start API Server

```bash
node api.js
```

Backend runs at → `http://localhost:3000/`

---

## 2️⃣ Frontend — Django Web Application

### Step 1: Move to Frontend Directory

```bash
cd myproject
```

### Step 2: Create Virtual Environment

```bash
python3 -m venv myenv
```

### Step 3: Activate Environment

```bash
source myenv/bin/activate
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Create `.env` File

```
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_password
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
NODE_ENV=development
```

### Step 6: Apply Database Migrations

```bash
python manage.py migrate
```

### Step 7: Run the Server

```bash
python manage.py runserver
```

Frontend runs at → `http://127.0.0.1:8000/`

---

# 3️⃣ Blockchain Data & Chaincode Operations

### Step 1: Set Org1 Context

```bash
source setOrg1.sh
```

---

### 🏗️ Create Land Request

```bash
peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls --cafile $ORDERER_CA \
  -C mychannel \
  -n landrecords \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE \
  -c '{"Args":["createLandRequest", "12345", "{\"owner\":\"John Doe\",\"area\":\"500 sqft\",\"location\":\"Sector 21\",\"status\":\"Pending\",\"currently_with\":\"clerk\"}"]}'
```

### 🔍 Read Specific Record

```bash
peer chaincode query \
  -C mychannel \
  -n landrecords \
  -c '{"Args":["readLandRequest", "12345"]}'
```

### 🔁 Update Record Status

```bash
peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls --cafile $ORDERER_CA \
  -C mychannel \
  -n landrecords \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE \
  -c '{"Args":["updateLandStatus", "12345", "Approved", "superintendent", "Verified documents", "clerk", "2025-03-31T23:30:00Z"]}'
```

### 📋 Query All Records

```bash
peer chaincode query \
  -C mychannel \
  -n landrecords \
  -c '{"Args":["getAllLandRequests"]}'
```

---

# 🌐 API Endpoints

### Create Land Request

```bash
curl -X POST http://localhost:3000/api/landrequests/create \
  -H "Content-Type: application/json" \
  -d '{
    "receiptNumber": "12345",
    "data": {
      "owner": "John Doe",
      "area": "500 sqft",
      "location": "Sector 21",
      "status": "Pending",
      "currently_with": "clerk",
      "history": []
    }
  }'
```

### Fetch All Records

```bash
curl http://localhost:3000/api/landrequests | jq
```

---

## 🛠️ Troubleshooting

| Issue              | Check/Fix                               |             |
| ------------------ | --------------------------------------- | ----------- |
| TLS/Cert errors    | Verify certificate paths                |             |
| API not connecting | Re-run `source setup.sh`                |             |
| Peer not running   | `docker ps                              | grep peer0` |
| Wallet issues      | Delete `fabric-api/wallet/` and restart |             |

---

## 🤝 Contributing

Pull requests & feature enhancements are welcome.

---

## 📄 License

MIT License
