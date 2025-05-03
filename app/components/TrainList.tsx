import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import TrainCard from "./TrainCard";

type Train = {
  id: string;
  number: string;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: Array<{
    type: string;
    price: number;
    availability: "available" | "rac" | "waitlist";
    seats?: number;
    waitlistNumber?: number;
  }>;
  from: string;
  to: string;
};

type TrainListProps = {
  trains: Train[];
  loading?: boolean;
  onSelectTrain?: (train: Train) => void;
};

const TrainList = ({
  trains = [
    {
      id: "1",
      number: "12301",
      name: "Rajdhani Express",
      departureTime: "16:50",
      arrivalTime: "10:20",
      duration: "17h 30m",
      from: "New Delhi",
      to: "Howrah",
      classes: [
        { type: "3A", price: 1245, availability: "available", seats: 42 },
        { type: "2A", price: 2150, availability: "rac", seats: 2 },
        {
          type: "1A",
          price: 3600,
          availability: "waitlist",
          waitlistNumber: 12,
        },
      ],
    },
    {
      id: "2",
      number: "12259",
      name: "Shatabdi Express",
      departureTime: "06:15",
      arrivalTime: "12:40",
      duration: "6h 25m",
      from: "New Delhi",
      to: "Lucknow",
      classes: [
        { type: "CC", price: 850, availability: "available", seats: 120 },
        { type: "EC", price: 1650, availability: "available", seats: 35 },
      ],
    },
    {
      id: "3",
      number: "12909",
      name: "Garib Rath Express",
      departureTime: "20:35",
      arrivalTime: "08:55",
      duration: "12h 20m",
      from: "Mumbai Central",
      to: "Hazrat Nizamuddin",
      classes: [
        {
          type: "3A",
          price: 835,
          availability: "waitlist",
          waitlistNumber: 25,
        },
        { type: "2A", price: 1450, availability: "rac", seats: 1 },
      ],
    },
  ],
  loading = false,
  onSelectTrain = () => {},
}: TrainListProps) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0369a1" />
        <Text className="mt-4 text-gray-600">Searching for trains...</Text>
      </View>
    );
  }

  if (trains.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-xl font-bold text-gray-800">No trains found</Text>
        <Text className="text-gray-600 text-center mt-2">
          Try changing your search criteria or select a different date
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200">
        {trains.length} trains found
      </Text>
      <FlatList
        data={trains}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrainCard train={item} onPress={() => onSelectTrain(item)} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};

export default TrainList;
