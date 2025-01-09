import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors1';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Redirect } from 'expo-router';
import { useAuth } from '../(auth)/authContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // If authenticated but no user, try to get username from storage
  if (!user?.username) {
    console.log("No user data in context, falling back to default");
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0082ad', // Active tab label color
        tabBarInactiveTintColor: 'gray', // Inactive tab label color
        tabBarActiveBackgroundColor : '#babfbf', // Active tab background color
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 14, // Font size of tab labels
          fontWeight: 'bold', // Make tab labels bold
          fontFamily: 'arial',
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: '#dae0e0', // Background color
            height: 60, // Height of the tab bar
            borderTopWidth: 0, // Remove top border
            paddingHorizontal: 0, // Add horizontal padding
          },
          default: {
            backgroundColor: '#dae0e0', // Background color
            height: 60, // Height of the tab bar
            borderTopWidth: 0, // Remove top border
            paddingHorizontal: 0, // Add horizontal padding
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Message',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="[username]"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="code" color={color} />,
        }}
        initialParams={{
          username: user?.username  // Provide a fallback value
        }}
      />
    </Tabs>
  );
}
