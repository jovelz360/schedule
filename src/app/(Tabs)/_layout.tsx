import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="logIn" options={{ title: "Log in" }} />
            <Tabs.Screen name="signUp" options={{ title: "Sign up" }} />
        </Tabs>
    );
}
