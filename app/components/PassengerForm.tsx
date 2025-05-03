import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { ChevronDown, User, Save, Plus } from "lucide-react-native";

interface PassengerFormProps {
  onSubmit?: (data: PassengerData[]) => void;
  isVisible?: boolean;
}

interface PassengerData {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  berthPreference: string;
  idType: string;
  idNumber: string;
}

const savedProfiles = [
  {
    id: "1",
    name: "Rahul Sharma",
    age: "32",
    gender: "Male" as const,
    berthPreference: "Lower",
    idType: "Aadhaar",
    idNumber: "XXXX-XXXX-1234",
  },
  {
    id: "2",
    name: "Priya Singh",
    age: "28",
    gender: "Female" as const,
    berthPreference: "Upper",
    idType: "PAN Card",
    idNumber: "ABCDE1234F",
  },
];

const berthOptions = [
  "No Preference",
  "Lower",
  "Middle",
  "Upper",
  "Side Lower",
  "Side Upper",
];
const idTypes = [
  "Aadhaar",
  "PAN Card",
  "Driving License",
  "Passport",
  "Voter ID",
];

export default function PassengerForm({
  onSubmit = () => {},
  isVisible = true,
}: PassengerFormProps) {
  const [useSavedProfile, setUseSavedProfile] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBerthDropdown, setShowBerthDropdown] = useState(false);
  const [showIdTypeDropdown, setShowIdTypeDropdown] = useState(false);

  const [passengers, setPassengers] = useState<PassengerData[]>([
    {
      name: "",
      age: "",
      gender: "Male",
      berthPreference: "No Preference",
      idType: "Aadhaar",
      idNumber: "",
    },
  ]);

  const handleAddPassenger = () => {
    setPassengers([
      ...passengers,
      {
        name: "",
        age: "",
        gender: "Male",
        berthPreference: "No Preference",
        idType: "Aadhaar",
        idNumber: "",
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      const newPassengers = [...passengers];
      newPassengers.splice(index, 1);
      setPassengers(newPassengers);
    }
  };

  const updatePassenger = (
    index: number,
    field: keyof PassengerData,
    value: string,
  ) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleSelectProfile = (profileId: string) => {
    const profile = savedProfiles.find((p) => p.id === profileId);
    if (profile) {
      setSelectedProfileId(profileId);
      setPassengers([
        {
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          berthPreference: profile.berthPreference,
          idType: profile.idType,
          idNumber: profile.idNumber,
        },
      ]);
    }
  };

  const handleSubmit = () => {
    onSubmit(passengers);
  };

  if (!isVisible) return null;

  return (
    <ScrollView className="bg-white flex-1 p-4">
      <Text className="text-2xl font-bold mb-4 text-blue-800">
        Passenger Details
      </Text>

      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-base font-medium">
          Use saved traveler profile
        </Text>
        <Switch
          value={useSavedProfile}
          onValueChange={setUseSavedProfile}
          trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
        />
      </View>

      {useSavedProfile ? (
        <View className="mb-6">
          <Text className="text-base font-medium mb-2">Select Profile</Text>
          {savedProfiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              className={`border rounded-lg p-4 mb-2 ${selectedProfileId === profile.id ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
              onPress={() => handleSelectProfile(profile.id)}
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <User size={20} color="#1e40af" />
                </View>
                <View>
                  <Text className="font-medium text-base">{profile.name}</Text>
                  <Text className="text-gray-500">
                    {profile.age} years • {profile.gender}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        passengers.map((passenger, index) => (
          <View
            key={index}
            className="mb-6 border border-gray-200 rounded-lg p-4"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-medium">Passenger {index + 1}</Text>
              {passengers.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemovePassenger(index)}
                  className="bg-red-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-red-600">Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1 text-gray-700">
                Full Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={passenger.name}
                onChangeText={(text) => updatePassenger(index, "name", text)}
                placeholder="Enter passenger name"
              />
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium mb-1 text-gray-700">
                  Age
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                  value={passenger.age}
                  onChangeText={(text) => updatePassenger(index, "age", text)}
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium mb-1 text-gray-700">
                  Gender
                </Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 flex-row justify-between items-center"
                  onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                >
                  <Text>{passenger.gender}</Text>
                  <ChevronDown size={16} color="#6b7280" />
                </TouchableOpacity>
                {showGenderDropdown && (
                  <View className="border border-gray-300 rounded-lg mt-1 bg-white absolute top-16 left-0 right-0 z-10">
                    {["Male", "Female", "Other"].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        className="p-3 border-b border-gray-200"
                        onPress={() => {
                          updatePassenger(
                            index,
                            "gender",
                            gender as "Male" | "Female" | "Other",
                          );
                          setShowGenderDropdown(false);
                        }}
                      >
                        <Text>{gender}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1 text-gray-700">
                Berth Preference
              </Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 flex-row justify-between items-center"
                onPress={() => setShowBerthDropdown(!showBerthDropdown)}
              >
                <Text>{passenger.berthPreference}</Text>
                <ChevronDown size={16} color="#6b7280" />
              </TouchableOpacity>
              {showBerthDropdown && (
                <View className="border border-gray-300 rounded-lg mt-1 bg-white absolute top-16 left-0 right-0 z-10">
                  {berthOptions.map((berth) => (
                    <TouchableOpacity
                      key={berth}
                      className="p-3 border-b border-gray-200"
                      onPress={() => {
                        updatePassenger(index, "berthPreference", berth);
                        setShowBerthDropdown(false);
                      }}
                    >
                      <Text>{berth}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1 text-gray-700">
                ID Proof Type
              </Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 flex-row justify-between items-center"
                onPress={() => setShowIdTypeDropdown(!showIdTypeDropdown)}
              >
                <Text>{passenger.idType}</Text>
                <ChevronDown size={16} color="#6b7280" />
              </TouchableOpacity>
              {showIdTypeDropdown && (
                <View className="border border-gray-300 rounded-lg mt-1 bg-white absolute top-16 left-0 right-0 z-10">
                  {idTypes.map((idType) => (
                    <TouchableOpacity
                      key={idType}
                      className="p-3 border-b border-gray-200"
                      onPress={() => {
                        updatePassenger(index, "idType", idType);
                        setShowIdTypeDropdown(false);
                      }}
                    >
                      <Text>{idType}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View className="mb-2">
              <Text className="text-sm font-medium mb-1 text-gray-700">
                ID Number
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={passenger.idNumber}
                onChangeText={(text) =>
                  updatePassenger(index, "idNumber", text)
                }
                placeholder="Enter ID number"
              />
            </View>
          </View>
        ))
      )}

      {!useSavedProfile && (
        <TouchableOpacity
          onPress={handleAddPassenger}
          className="flex-row items-center justify-center p-3 mb-6 border border-dashed border-blue-500 rounded-lg"
        >
          <Plus size={18} color="#3b82f6" />
          <Text className="ml-2 text-blue-500 font-medium">
            Add Another Passenger
          </Text>
        </TouchableOpacity>
      )}

      {!useSavedProfile && (
        <TouchableOpacity className="flex-row items-center mb-6 p-3 border border-gray-300 rounded-lg bg-gray-50">
          <Save size={18} color="#4b5563" />
          <Text className="ml-2 text-gray-600">Save as traveler profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 p-4 rounded-lg items-center mb-6"
      >
        <Text className="text-white font-bold text-base">
          Continue to Payment
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
