# Google Calendar Setup for Discord Bot

## Steps to Enable Google Calendar API

### 1. Generate a Service Account Credential File

To enable Google Calendar API access, you need to create a service account and obtain a credentials file in JSON format.

#### Steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your existing project or create a new one.
3. In the left menu, navigate to **IAM & Admin > Service Accounts**.
4. Click **Create Service Account** (if you don’t have one already).
5. Assign the required permissions to access Google Calendar API (such as **Editor** or **Owner**).
6. Generate a key for the service account:
   - Click on the service account.
   - Go to the **Keys** tab.
   - Click **Add Key** > **Create New Key**.
   - Select **JSON** format and download the file.
7. The downloaded JSON file will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account-email@your-project-id.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email@your-project-id.iam.gserviceaccount.com"
}
```

### 2. Replace the Credentials File

Save the downloaded JSON file in the project directory where google-keys.json is expected, or update your code to use the correct path.

### 3. Share the Calendar with the Service Account

Since service accounts don’t have automatic access to Google Calendars, you need to share the calendar manually.

Steps:

1. Open Google Calendar.
2. Select the calendar you want to share.
3. Go to Settings & Sharing.
4. Under Share with specific people, add the service account email: your-service-account-email@your-project-id.iam.gserviceaccount.com.
5. Assign appropriate permissions (e.g., Make changes and manage sharing).
6. Once these steps are completed, your service account will have access to Google Calendar, and your Discord bot can interact with it as needed.
