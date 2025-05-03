import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { User } from "lucide-react-native";
import SearchForm from "./components/SearchForm";
import TrainList from "./components/TrainList";
import PassengerForm from "./components/PassengerForm";

export default function HomeScreen() {
  const [currentStep, setCurrentStep] = useState("search"); // 'search', 'results', 'booking'
  const [selectedTrain, setSelectedTrain] = useState(null);

  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState([]);

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      console.log("Search params:", searchParams);

      // Import and use the searchTrains function from trainService
      const { searchTrains } = await import("./services/trainService");
      const results = await searchTrains(searchParams);

      setTrains(results);
      setCurrentStep("results");
    } catch (error) {
      console.error("Error searching for trains:", error);
      alert("Failed to search for trains. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrain = (train) => {
    setSelectedTrain(train);
    setCurrentStep("booking");
  };

  const handleBookingComplete = () => {
    // In a real app, this would handle the booking process
    alert("Booking completed successfully!");
    setCurrentStep("search");
    setSelectedTrain(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 bg-blue-600">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=trainapp",
              }}
              className="w-8 h-8 mr-2"
              style={{ width: 32, height: 32 }}
            />
            <Text className="text-xl font-bold text-white">TrainBooker</Text>
          </View>
          <TouchableOpacity className="p-2 rounded-full bg-blue-500">
            <User size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="p-4">
          {currentStep === "search" && (
            <>
              <Text className="text-2xl font-bold mb-4 text-gray-800">
                Find Your Train
              </Text>
              <SearchForm onSearch={handleSearch} isLoading={loading} />
            </>
          )}

          {currentStep === "results" && (
            <>
              <TouchableOpacity
                onPress={() => setCurrentStep("search")}
                className="mb-4 flex-row items-center"
              >
                <Text className="text-blue-600 font-semibold">
                  ← Back to Search
                </Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold mb-4 text-gray-800">
                Available Trains
              </Text>
              <TrainList
                trains={trains}
                loading={loading}
                onSelectTrain={handleSelectTrain}
              />
            </>
          )}

          {currentStep === "booking" && selectedTrain && (
            <>
              <TouchableOpacity
                onPress={() => setCurrentStep("results")}
                className="mb-4 flex-row items-center"
              >
                <Text className="text-blue-600 font-semibold">
                  ← Back to Train List
                </Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold mb-2 text-gray-800">
                Passenger Details
              </Text>
              <Text className="text-gray-600 mb-4">
                Train: {selectedTrain.name || "Selected Train"} (
                {selectedTrain.number || "12345"})
              </Text>
              <PassengerForm onSubmit={handleBookingComplete} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
