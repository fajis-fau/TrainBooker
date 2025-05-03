import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Clock, Train } from "lucide-react-native";

interface TrainCardProps {
  trainNumber?: string;
  trainName?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  classes?: Array<{
    name: string;
    price: number;
    availability: "available" | "rac" | "waitlist";
    seats?: number;
  }>;
  onPress?: () => void;
}

const TrainCard = ({
  trainNumber = "12345",
  trainName = "Rajdhani Express",
  departureTime = "06:00",
  arrivalTime = "14:30",
  duration = "8h 30m",
  classes = [
    { name: "SL", price: 450, availability: "available", seats: 42 },
    { name: "3A", price: 1200, availability: "rac", seats: 4 },
    { name: "2A", price: 2100, availability: "waitlist", seats: 0 },
  ],
  onPress = () => {},
}: TrainCardProps) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rac":
        return "bg-yellow-100 text-yellow-800";
      case "waitlist":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityText = (availability: string, seats?: number) => {
    switch (availability) {
      case "available":
        return `Available (${seats})`;
      case "rac":
        return `RAC (${seats})`;
      case "waitlist":
        return "Waitlist";
      default:
        return "Unknown";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Train size={18} color="#4b5563" />
          <Text className="ml-2 font-bold text-gray-800">
            {trainNumber} - {trainName}
          </Text>
        </View>
        <ChevronRight size={18} color="#9ca3af" />
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-lg font-bold text-gray-800">
            {departureTime}
          </Text>
          <Text className="text-xs text-gray-500">Departure</Text>
        </View>

        <View className="flex-row items-center">
          <View className="h-0.5 w-16 bg-gray-300" />
          <View className="flex-row items-center mx-1">
            <Clock size={14} color="#6b7280" />
            <Text className="text-xs text-gray-500 ml-1">{duration}</Text>
          </View>
          <View className="h-0.5 w-16 bg-gray-300" />
        </View>

        <View>
          <Text className="text-lg font-bold text-gray-800">{arrivalTime}</Text>
          <Text className="text-xs text-gray-500">Arrival</Text>
        </View>
      </View>

      <View className="border-t border-gray-100 pt-2">
        <Text className="text-xs text-gray-500 mb-2">Available Classes</Text>
        <View className="flex-row flex-wrap">
          {classes.map((classItem, index) => (
            <View key={index} className="mr-3 mb-1">
              <View className="flex-row items-center">
                <Text className="font-medium text-gray-800 mr-2">
                  {classItem.name}
                </Text>
                <Text className="text-gray-800">₹{classItem.price}</Text>
              </View>
              <View
                className={`rounded-full px-2 py-0.5 mt-1 ${getAvailabilityColor(classItem.availability)}`}
              >
                <Text className="text-xs">
                  {getAvailabilityText(classItem.availability, classItem.seats)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrainCard;
