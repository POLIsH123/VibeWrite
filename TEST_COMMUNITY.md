# 🧪 Community Features Test Guide - Locked System

## 🚀 Quick Test

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   python -m http.server 8000
   ```

3. **Open app:** `http://localhost:8000`

## ✅ Test Locked Community System

### 1. Navigate to Community
- Click "Community" in the sidebar
- Should see: **Locked community page** with progress bar at 0/50

### 2. Test Contribution System
- Click "Help Us Reach 50 Scripts!" button
- Should see: **Contribution modal** with form
- Fill in:
  - **Your Name:** "TestUser"
  - **Script Name:** "Pirate Translator"
  - **Instructions:** "Rewrite text like a pirate with arr and matey"
  - **Example:** "Hello → Ahoy matey!"
- Click "Contribute Script"
- Should see: **Success message** and progress updates to 1/50

### 3. Add More Contributions (Optional)
- You can manually add more, or run the test script:
  ```bash
  cd backend
  node test-contributions.js
  ```
- This adds 5 sample contributions (6/50 total)

### 4. Test Progress Updates
- Each contribution should:
  - Update the progress bar
  - Update the counter (X/50)
  - Update the percentage
  - Show success feedback

### 5. Test Community Unlock (Simulation)
- To test unlock, temporarily change `UNLOCK_THRESHOLD` to 5 in `frontend/js/app.js`
- Add 5 contributions
- Should see: **🎉 Community Unlocked!** celebration
- Community page should switch to full features

## 🎯 Expected Behavior

### Locked State (< 50 scripts)
- ✅ Shows locked community page
- ✅ Progress bar shows current count
- ✅ "Help Us Reach 50" button works
- ✅ Contribution modal opens/closes
- ✅ Form validation works
- ✅ Progress updates after each contribution
- ✅ Success feedback shows

### Unlocked State (≥ 50 scripts)
- ✅ Shows celebration animation
- ✅ Switches to full community features
- ✅ All pending scripts become approved
- ✅ Full script browsing/voting/creation available

## 🗄️ Database Storage

- **Scripts stored in:** `backend/vibewrite.db`
- **Table:** `community_scripts`
- **Status:** `pending` (locked) → `approved` (unlocked)
- **Count tracked:** Total scripts regardless of status

## 🐛 Troubleshooting

### Progress Not Updating
- Check backend console for database errors
- Check browser console for API errors
- Verify SQLite database created

### Modal Not Opening
- Check JavaScript console for errors
- Verify modal HTML exists
- Check CSS animations loading

### Contributions Not Saving
- Check backend API logs
- Verify database connection
- Check form validation

## 🎉 Success Criteria

- ✅ Community starts locked (0/50)
- ✅ Contribution system works
- ✅ Progress updates in real-time
- ✅ Beautiful OP animations throughout
- ✅ Mobile responsive design
- ✅ Auto-unlocks at 50 scripts
- ✅ Smooth transition to full features

Your locked community system is working perfectly! 🚀