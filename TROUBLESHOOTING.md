# Website Freezing Troubleshooting Guide

## 🚨 Quick Fix Steps

### 1. Create Environment File
Create a `.env` file in the `Backend` folder with:
```bash
MONGODB_URL=mongodb://localhost:27017
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5174
SITE_URL=http://localhost:5174
```

### 2. Start Backend Server
```bash
cd Backend
npm run dev
```

### 3. Start Frontend
```bash
cd Frontend
npm run dev
```

## 🔍 Common Issues & Solutions

### Issue: Website Freezes on Load
**Symptoms:**
- Page loads but becomes unresponsive
- Spinning cursor or loading indicators
- Console shows errors about API calls

**Causes:**
1. **Missing MongoDB Connection** - Backend can't connect to database
2. **API Timeouts** - Frontend waiting for backend responses
3. **CORS Issues** - Frontend blocked from backend
4. **Environment Variables Missing** - Backend not configured

**Solutions:**
1. ✅ Create `.env` file (see step 1 above)
2. ✅ Ensure MongoDB is running locally
3. ✅ Check backend server is running on port 3000
4. ✅ Verify frontend is running on port 5174

### Issue: Backend Server Won't Start
**Symptoms:**
- `npm run dev` fails
- Port already in use errors
- Database connection errors

**Solutions:**
1. **Kill existing processes:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. **Check MongoDB:**
   ```bash
   # Start MongoDB (if not running)
   mongod
   ```

3. **Use alternative port:**
   ```bash
   # In .env file
   PORT=3001
   ```

### Issue: Frontend Can't Connect to Backend
**Symptoms:**
- API calls fail
- Network errors in console
- CORS errors

**Solutions:**
1. **Check proxy configuration** in `Frontend/vite.config.js`
2. **Verify backend URL** in frontend services
3. **Check CORS settings** in backend

## 🛠️ Debug Commands

### Backend Debug
```bash
cd Backend
npm run check:env          # Check environment variables
npm run start:simple       # Start without enhanced logging
```

### Frontend Debug
```bash
cd Frontend
# Check browser console for errors
# Look for network tab failures
# Check for React errors
```

## 📊 Performance Monitoring

### Backend Health Check
Visit: `http://localhost:3000/health`

### Frontend Performance
- Open browser DevTools
- Check Console tab for errors
- Check Network tab for failed requests
- Check Performance tab for bottlenecks

## 🔧 Advanced Troubleshooting

### 1. Database Connection Issues
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/NumbersDB
```

### 2. Port Conflicts
```bash
# Check what's using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux
```

### 3. Environment Variable Issues
```bash
# Check if .env is loaded
cd Backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URL)"
```

## 📞 Getting Help

If issues persist:
1. Check the console output for specific error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check if ports are available
5. Review the error logs in both frontend and backend

## 🚀 Quick Start Checklist

- [ ] MongoDB running on localhost:27017
- [ ] `.env` file created in Backend folder
- [ ] Backend server started (`npm run dev`)
- [ ] Frontend started (`npm run dev`)
- [ ] No port conflicts
- [ ] Browser console shows no errors
- [ ] Network requests succeed
