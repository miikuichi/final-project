# Google Maps API Integration Setup

## Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Geocoding API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Geocoding API"
   - Click on it and press "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## Step 2: Set Up the API Key

### Option 1: Environment Variable (Recommended)

Set the environment variable before starting your application:

**Windows:**

```cmd
set GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Linux/Mac:**

```bash
export GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Option 2: Direct Configuration

Edit `application.properties` and replace the placeholder:

```properties
google.maps.api.key=your_actual_api_key_here
```

## Step 3: Secure Your API Key

1. In Google Cloud Console, go to your API key settings
2. Under "Application restrictions", set restrictions:
   - For development: "HTTP referrers" with `localhost:*`
   - For production: Set your actual domain
3. Under "API restrictions", select "Restrict key" and choose only "Geocoding API"

## Step 4: Test the Integration

1. Start your backend server
2. Try adding a new employee with address information
3. Check the console logs for address validation messages

## How It Works

- **With API Key**: Addresses are validated using Google Maps Geocoding API
- **Without API Key**: Falls back to basic format validation (ZIP code + state validation)

## API Usage Limits

- Google Maps Geocoding API: $200 free credit per month (approximately 40,000 requests)
- For production, monitor your usage in Google Cloud Console

## Troubleshooting

- If you see "Address validation service error" in logs, check your API key and network connection
- Make sure the Geocoding API is enabled in Google Cloud Console
- Verify your API key restrictions allow requests from your application
