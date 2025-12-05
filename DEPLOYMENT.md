# Deployment Guide - GitHub Pages

## 🚀 Automatic Deployment Setup

Your app is now configured for automatic deployment to GitHub Pages! Every time you push to the `main` branch, GitHub Actions will automatically build and deploy your app.

## 📋 Steps to Enable GitHub Pages

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository: https://github.com/ashurauza/Seminar_Auditorium_Allocation_App
2. Click on **Settings** (top right)
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**:
   - **Source:** Select "GitHub Actions"
5. Save the settings

### 2. Wait for Deployment

After pushing the code (which we just did), GitHub Actions will:
- Automatically trigger the deployment workflow
- Install dependencies
- Build the production version
- Deploy to GitHub Pages

This takes about 2-3 minutes.

### 3. Check Deployment Status

1. Go to the **Actions** tab in your repository
2. You'll see the workflow "Deploy to GitHub Pages" running
3. Wait for it to complete (green checkmark ✅)

### 4. Access Your Deployed App

Once deployed, your app will be available at:

**🌐 https://ashurauza.github.io/Seminar_Auditorium_Allocation_App/**

## 📁 What Was Configured

### 1. **vite.config.js**
Added base path for GitHub Pages:
```javascript
base: '/Seminar_Auditorium_Allocation_App/'
```

### 2. **.github/workflows/deploy.yml**
Created GitHub Actions workflow that:
- Runs on every push to `main` branch
- Builds the project with `npm run build`
- Deploys the `dist` folder to GitHub Pages

## 🔄 Future Deployments

Every time you push code to the `main` branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will automatically redeploy your app! 🎉

## 🧪 Testing Before Deployment

Always test locally before pushing:
```bash
# Development mode
npm run dev

# Build for production (test build)
npm run build

# Preview production build locally
npm run preview
```

## 📝 Deployment Checklist

- ✅ vite.config.js updated with base path
- ✅ GitHub Actions workflow created
- ✅ Code pushed to GitHub
- ⏳ Enable GitHub Pages in repository settings (manual step)
- ⏳ Wait for first deployment to complete
- ⏳ Access your live app!

## 🔧 Troubleshooting

### Deployment Failed?
1. Check the **Actions** tab for error messages
2. Ensure `package.json` has all dependencies
3. Verify the build works locally: `npm run build`

### 404 Error?
1. Make sure GitHub Pages is enabled in settings
2. Verify the base path in vite.config.js matches your repo name
3. Wait a few minutes after deployment

### Blank Page?
1. Check browser console for errors
2. Ensure all asset paths are relative
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

## 📱 Sharing Your App

Once deployed, share your app with:
- Project submission form
- FSD trainer
- Classmates
- Portfolio

**Live URL:** https://ashurauza.github.io/Seminar_Auditorium_Allocation_App/

---

**Created by:** Ashutosh Kumar Singh
**Roll No:** 2300321530046
**Batch:** 2023-27 (3rd Year, 5th Semester)
