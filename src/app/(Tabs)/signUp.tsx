import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../styles/globalStyles';

export default function SignUp() {
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidEmail = (value: string) => value.trim().includes('@') && value.trim().length > 0;
  const isValidIdNumber = idNumber.trim().length === 14;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isSignUpValid = isValidIdNumber && isValidEmail(email) && passwordsMatch;

  const handleCreateAccount = () => {
    if (isSignUpValid) {
      router.push('/home');
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.logoWrap}>
        <Image source={require('../../../assets/logo.png')} style={globalStyles.logo} />
      </View>

      <View style={globalStyles.formCard}>
        <View style={globalStyles.form}>
          <TextInput
            placeholder="ID number"
            value={idNumber}
            onChangeText={setIdNumber}
            keyboardType="number-pad"
            autoCorrect={false}
            style={globalStyles.input}
          />

          <View style={globalStyles.inputGroup}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={globalStyles.input}
            />
          </View>

          <View style={globalStyles.inputGroup}>
            <View style={globalStyles.inputRow}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={[globalStyles.input, globalStyles.passwordInput]}
              />

              {password.length > 0 && (
                <TouchableOpacity
                  style={globalStyles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Text style={globalStyles.eyeText}></Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={globalStyles.inputGroup}>
            <View style={globalStyles.inputRow}>
              <TextInput
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={[globalStyles.input, globalStyles.passwordInput]}
              />

              {confirmPassword.length > 0 && (
                <TouchableOpacity
                  style={globalStyles.eyeButton}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Text style={globalStyles.eyeText}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[globalStyles.primaryButton, !isSignUpValid && globalStyles.primaryButtonDisabled]}
            activeOpacity={0.9}
            disabled={!isSignUpValid}
            onPress={handleCreateAccount}
          >
            <Text style={[globalStyles.primaryButtonText, !isSignUpValid && globalStyles.primaryButtonTextDisabled]}>
              Create account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.secondaryButton}
            activeOpacity={0.9}
            onPress={() => router.push('/(Tabs)/logIn')}
          >
            <Text style={globalStyles.secondaryButtonText}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}