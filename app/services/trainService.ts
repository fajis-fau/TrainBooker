import { Alert } from "react-native";

// Define the train data structure based on our app's needs
export interface TrainSearchParams {
  origin: string;
  destination: string;
  date: string;
  classType: string;
  useMockData?: boolean; // Optional flag to use mock data instead of API
}

export interface TrainClass {
  type: string;
  price: number;
  availability: "available" | "rac" | "waitlist";
  seats?: number;
  waitlistNumber?: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
  from: string;
  to: string;
}

// Google Transit API configuration
const GOOGLE_TRANSIT_API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your actual API key
const GOOGLE_TRANSIT_API_URL = "https://transit.googleapis.com/v1/routes";

// Config to control whether to use real API or mock data
const USE_REAL_API = false; // Set to true when ready to use the real API

/**
 * Searches for trains based on the provided parameters
 * Connects to the Google Transit API or uses mock data based on configuration
 */
export const searchTrains = async (
  params: TrainSearchParams,
): Promise<Train[]> => {
  try {
    console.log("Searching for trains with params:", params);

    // Use mock data if explicitly requested or if USE_REAL_API is false
    if (params.useMockData || !USE_REAL_API) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return generateMockTrains(params);
    }

    // Format the date for the API request (YYYY-MM-DD to API format if needed)
    const formattedDate = formatDateForApi(params.date);

    // Make the actual API call to Google Transit API with parameters to get all available trains
    // Adding maxResults=50 to get more results (adjust based on API documentation)
    const response = await fetch(
      `${GOOGLE_TRANSIT_API_URL}?key=${GOOGLE_TRANSIT_API_KEY}&origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}&date=${formattedDate}&mode=train&maxResults=50&alternatives=true`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API returned data with", data.routes?.length || 0, "routes");
    return mapGoogleTransitResponseToTrains(data, params);
  } catch (error) {
    console.error("Error searching for trains:", error);
    Alert.alert("Error", "Failed to search for trains. Please try again.");
    return [];
  }
};

/**
 * Formats the date string for the API request
 */
const formatDateForApi = (dateString: string): string => {
  // Google Transit API might require a specific date format
  // For now, we'll just return the date as is (assuming YYYY-MM-DD format)
  return dateString;
};

/**
 * Maps the Google Transit API response to our Train interface
 */
const mapGoogleTransitResponseToTrains = (
  apiResponse: any,
  params: TrainSearchParams,
): Train[] => {
  // This is a placeholder implementation
  // In a real app, you would parse the actual API response structure

  try {
    // Check if the API response has the expected structure
    if (!apiResponse || !apiResponse.routes) {
      console.warn("Unexpected API response format", apiResponse);
      return [];
    }

    // Ensure we're getting all available routes, not just the first page
    const allRoutes = apiResponse.routes || [];
    console.log(`Found ${allRoutes.length} routes in API response`);

    return allRoutes.map((route: any, index: number) => {
      // Extract relevant data from the route object
      // This mapping will depend on the actual structure of the Google Transit API response
      const trainId = route.routeId || `train-${index + 1}`;
      const trainNumber = route.trainNumber || `${10000 + index}`;
      const trainName = route.name || `Train ${trainNumber}`;

      // Extract departure and arrival times
      const departureTime = route.legs?.[0]?.departure?.time || "00:00";
      const arrivalTime = route.legs?.[0]?.arrival?.time || "00:00";

      // Calculate duration
      const durationMinutes = route.legs?.[0]?.duration?.value || 0;
      const durationHours = Math.floor(durationMinutes / 60);
      const remainingMinutes = durationMinutes % 60;
      const duration = `${durationHours}h ${remainingMinutes}m`;

      // Map available classes and fares
      const classes = mapClassesFromApiResponse(route.fare, params.classType);

      return {
        id: trainId,
        number: trainNumber,
        name: trainName,
        departureTime,
        arrivalTime,
        duration,
        from: params.origin,
        to: params.destination,
        classes,
      };
    });
  } catch (error) {
    console.error("Error mapping API response:", error);
    return [];
  }
};

/**
 * Maps fare information from the API response to our TrainClass interface
 */
const mapClassesFromApiResponse = (
  fareInfo: any,
  preferredClass: string,
): TrainClass[] => {
  // This is a placeholder implementation
  // In a real app, you would extract the actual fare and class information

  if (!fareInfo || !Array.isArray(fareInfo)) {
    // If no fare information is available, create some default classes
    return [
      {
        type:
          preferredClass === "Sleeper"
            ? "SL"
            : preferredClass === "3AC"
              ? "3A"
              : "2A",
        price: Math.floor(Math.random() * 1000) + 300,
        availability: "available",
        seats: Math.floor(Math.random() * 50) + 1,
      },
    ];
  }

  return fareInfo.map((fare: any) => ({
    type: fare.class || "SL",
    price: fare.amount || 500,
    availability: fare.availability || "available",
    seats: fare.seats,
    waitlistNumber: fare.waitlist,
  }));
};

/**
 * Generates mock train data based on search parameters
 * This simulates what we would get from the Google Transit API
 */
const generateMockTrains = (params: TrainSearchParams): Train[] => {
  // Generate a deterministic but seemingly random number based on the search parameters
  const getTrainCount = () => {
    // Return a larger number of trains to ensure all available options are shown
    return 15; // Increased from 2-8 to a fixed 15 trains
  };

  const trainCount = getTrainCount();
  const trains: Train[] = [];

  // Common train names in India
  const trainNames = [
    "Rajdhani Express",
    "Shatabdi Express",
    "Duronto Express",
    "Garib Rath Express",
    "Jan Shatabdi Express",
    "Sampark Kranti Express",
    "Vande Bharat Express",
    "Tejas Express",
    "Humsafar Express",
    "Antyodaya Express",
    "Gatimaan Express",
    "Double Decker Express",
    "Mahamana Express",
    "Kashi Vishwanath Express",
    "Vivek Express",
    "Deccan Queen",
    "Palace on Wheels",
    "Golden Chariot",
    "Maharajas' Express",
    "Fairy Queen Express",
  ];

  for (let i = 0; i < trainCount; i++) {
    // Generate departure time between 00:00 and 23:59
    const depHour = Math.floor(Math.random() * 24)
      .toString()
      .padStart(2, "0");
    const depMinute = Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0");
    const departureTime = `${depHour}:${depMinute}`;

    // Generate duration between 2 and 24 hours
    const durationHours = Math.floor(Math.random() * 22) + 2;
    const durationMinutes = Math.floor(Math.random() * 60);
    const duration = `${durationHours}h ${durationMinutes}m`;

    // Calculate arrival time
    const depTimeMinutes = parseInt(depHour) * 60 + parseInt(depMinute);
    const arrTimeMinutes =
      (depTimeMinutes + durationHours * 60 + durationMinutes) % (24 * 60);
    const arrHour = Math.floor(arrTimeMinutes / 60)
      .toString()
      .padStart(2, "0");
    const arrMinute = (arrTimeMinutes % 60).toString().padStart(2, "0");
    const arrivalTime = `${arrHour}:${arrMinute}`;

    // Generate train number
    const trainNumber = (10000 + Math.floor(Math.random() * 90000)).toString();

    // Generate classes based on the selected class type
    const classes: TrainClass[] = [];
    const availabilityOptions: ("available" | "rac" | "waitlist")[] = [
      "available",
      "rac",
      "waitlist",
    ];

    // Always include the selected class type
    const selectedClassMap: Record<string, string> = {
      Sleeper: "SL",
      "3AC": "3A",
      "2AC": "2A",
      "1AC": "1A",
      "Chair Car": "CC",
      General: "GN",
    };

    const selectedClassCode = selectedClassMap[params.classType] || "SL";

    // Add the selected class with higher chance of availability
    classes.push({
      type: selectedClassCode,
      price: Math.floor(Math.random() * 1000) + 300,
      availability:
        Math.random() > 0.3
          ? "available"
          : availabilityOptions[Math.floor(Math.random() * 3)],
      seats:
        Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 1 : undefined,
      waitlistNumber:
        Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 1 : undefined,
    });

    // Add 1-3 additional random classes
    const additionalClassCount = Math.floor(Math.random() * 3) + 1;
    const possibleClasses = Object.values(selectedClassMap).filter(
      (c) => c !== selectedClassCode,
    );

    for (let j = 0; j < additionalClassCount; j++) {
      if (j < possibleClasses.length) {
        classes.push({
          type: possibleClasses[j],
          price: Math.floor(Math.random() * 2000) + 300,
          availability: availabilityOptions[Math.floor(Math.random() * 3)],
          seats:
            Math.random() > 0.5
              ? Math.floor(Math.random() * 50) + 1
              : undefined,
          waitlistNumber:
            Math.random() > 0.7
              ? Math.floor(Math.random() * 30) + 1
              : undefined,
        });
      }
    }

    trains.push({
      id: (i + 1).toString(),
      number: trainNumber,
      name: trainNames[i % trainNames.length],
      departureTime,
      arrivalTime,
      duration,
      from: params.origin,
      to: params.destination,
      classes,
    });
  }

  return trains;
};
