# Deploying Your Portfolio to PythonAnywhere

This guide will walk you through deploying your Flask portfolio application to PythonAnywhere.

## Step 1: Create a PythonAnywhere Account

1. Go to [PythonAnywhere](https://www.pythonanywhere.com/) and sign up for a free account
2. After signing up, you'll be taken to your dashboard

## Step 2: Upload Your Code

### Option 1: Upload via the Web Interface

1. In your PythonAnywhere dashboard, click on the "Files" tab
2. Click "Upload a file" and select a ZIP archive of your portfolio project
3. After uploading, use the "Unzip" option to extract your files

### Option 2: Clone from GitHub (Recommended)

1. If your code is on GitHub, open a Bash console in PythonAnywhere
2. Run `git clone https://github.com/yourusername/your-repo.git`

## Step 3: Set Up a Virtual Environment

1. Open a Bash console in PythonAnywhere
2. Navigate to your project directory: `cd your-portfolio-directory`
3. Create a virtual environment: `python -m venv venv`
4. Activate it: `source venv/bin/activate`
5. Install requirements: `pip install -r requirements.txt`

## Step 4: Configure a Web App

1. Go to the "Web" tab in your PythonAnywhere dashboard
2. Click "Add a new web app"
3. Choose your domain name (e.g., yourusername.pythonanywhere.com)
4. Select "Manual configuration"
5. Choose Python 3.9

## Step 5: Configure WSGI File

1. In the web app configuration, look for the WSGI configuration file link and click it
2. Replace the contents with the code from your `wsgi.py` file or use the following:

```python
import sys
import os

# Add the project directory to the Python path
path = '/home/yourusername/your-portfolio-directory'
if path not in sys.path:
    sys.path.append(path)

# Import the Flask application
from app import app as application
```

3. Save the file

## Step 6: Set Up Static Files

1. In your web app configuration, scroll down to "Static files"
2. Add the following mappings:
   - URL: `/static/` → Directory: `/home/yourusername/your-portfolio-directory/static`
   - URL: `/css/` → Directory: `/home/yourusername/your-portfolio-directory/css`
   - URL: `/js/` → Directory: `/home/yourusername/your-portfolio-directory/js`
   - URL: `/images/` → Directory: `/home/yourusername/your-portfolio-directory/images`

## Step 7: Configure Virtual Environment

1. In your web app configuration, find "Virtualenv" section
2. Enter the path to your virtual environment: `/home/yourusername/your-portfolio-directory/venv`

## Step 8: Reload Your Web App

1. Click the green "Reload" button at the top of your web app configuration page
2. Wait a few seconds for the changes to take effect

## Step 9: Visit Your Website

Your portfolio should now be accessible at `yourusername.pythonanywhere.com`

## Troubleshooting

- If you encounter errors, check the error logs in the "Web" tab
- Make sure all file paths in the WSGI file are correct
- Ensure all required packages are installed in your virtual environment
- Check that static file mappings are correctly configured

## Additional Tips

- PythonAnywhere free accounts have limitations on outbound network access
- Your web app will be put to sleep after a period of inactivity on free accounts
- Consider upgrading to a paid account for more resources and features if needed
