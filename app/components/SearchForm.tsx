import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Calendar,
  ChevronDown,
  MapPin,
  Search,
  Train,
} from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { TrainSearchParams } from "../services/trainService";

interface SearchFormProps {
  onSearch?: (searchData: TrainSearchParams) => void;
  isLoading?: boolean;
}

const SearchForm = ({
  onSearch = () => {},
  isLoading = false,
}: SearchFormProps) => {
  const [origin, setOrigin] = useState<string>("New Delhi");
  const [destination, setDestination] = useState<string>("Mumbai Central");
  const [date, setDate] = useState<string>("2023-10-15");
  const [classType, setClassType] = useState<string>("Sleeper");
  const [showClassPicker, setShowClassPicker] = useState<boolean>(false);

  const classOptions = ["Sleeper", "3AC", "2AC", "1AC", "Chair Car", "General"];

  const handleSearch = () => {
    // Validate inputs
    if (!origin.trim()) {
      Alert.alert("Error", "Please enter an origin station");
      return;
    }

    if (!destination.trim()) {
      Alert.alert("Error", "Please enter a destination station");
      return;
    }

    if (origin.trim() === destination.trim()) {
      Alert.alert("Error", "Origin and destination cannot be the same");
      return;
    }

    // Call the onSearch callback with the search parameters
    onSearch({
      origin,
      destination,
      date,
      classType,
    });
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-md w-full">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-800">Find Trains</Text>
        <Train size={24} color="#4f46e5" />
      </View>

      {/* Origin Station */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-600 mb-1">From</Text>
        <View className="flex-row items-center border border-gray-300 rounded-md p-2">
          <MapPin size={20} color="#4f46e5" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            value={origin}
            onChangeText={setOrigin}
            placeholder="Enter origin station"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Destination Station */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-600 mb-1">To</Text>
        <View className="flex-row items-center border border-gray-300 rounded-md p-2">
          <MapPin size={20} color="#4f46e5" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            value={destination}
            onChangeText={setDestination}
            placeholder="Enter destination station"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Date Selection */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-600 mb-1">
          Date of Journey
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-md p-2">
          <Calendar size={20} color="#4f46e5" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            value={date}
            onChangeText={setDate}
            placeholder="Select date (YYYY-MM-DD)"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Class Preference */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-600 mb-1">
          Class Preference
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-between border border-gray-300 rounded-md p-2"
          onPress={() => setShowClassPicker(!showClassPicker)}
        >
          <Text className="text-gray-800">{classType}</Text>
          <ChevronDown size={20} color="#4f46e5" />
        </TouchableOpacity>

        {showClassPicker && (
          <View className="border border-gray-300 rounded-md mt-1 max-h-32">
            <ScrollView>
              {classOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`p-2 ${classType === option ? "bg-indigo-50" : ""}`}
                  onPress={() => {
                    setClassType(option);
                    setShowClassPicker(false);
                  }}
                >
                  <Text
                    className={`${classType === option ? "text-indigo-600 font-medium" : "text-gray-800"}`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Search Button */}
      <TouchableOpacity
        className="bg-indigo-600 py-3 rounded-md flex-row items-center justify-center"
        onPress={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white font-medium ml-2">Searching...</Text>
          </>
        ) : (
          <>
            <Search size={20} color="white" />
            <Text className="text-white font-medium ml-2">Search Trains</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SearchForm;
