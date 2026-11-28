import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ExpensesListScreen from '../screens/ExpensesListScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'SplitPay - Inicio' }}
            />
            <Stack.Screen
              name="ExpensesList"
              component={ExpensesListScreen}
              options={{ title: 'Gastos del Grupo' }}
            />
            <Stack.Screen
              name="CreateExpense"
              component={CreateExpenseScreen}
              options={{ title: 'Nuevo Gasto Común' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}