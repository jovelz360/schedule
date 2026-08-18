import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../styles/globalStyles';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const isValidEmail = (value: string) => value.trim().includes('@') && value.trim().length > 0;
  const isLoginValid = isValidEmail(email) && password.trim().length > 0;

  const handleLogin = () => {
    if (isLoginValid) {
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={globalStyles.input}
          />

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

          <TouchableOpacity
            style={globalStyles.linkButton}
            onPress={() => setForgotPasswordVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.primaryButton, !isLoginValid && globalStyles.primaryButtonDisabled]}
            activeOpacity={0.9}
            disabled={!isLoginValid}
            onPress={handleLogin}
          >
            <Text style={[globalStyles.primaryButtonText, !isLoginValid && globalStyles.primaryButtonTextDisabled]}>
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.secondaryButton}
            activeOpacity={0.9}
            onPress={() => router.push('/(Tabs)/signUp')}
          >
            <Text style={globalStyles.secondaryButtonText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={forgotPasswordVisible}
        animationType="fade"
        onRequestClose={() => setForgotPasswordVisible(false)}
      >
        <View style={globalStyles.modalBackdrop}>
          <View style={globalStyles.modalCard}>
            <Text style={globalStyles.modalTitle}>Reset password</Text>
            <Text style={globalStyles.modalText}>Enter your email address to receive reset instructions.</Text>

            <TextInput
              placeholder="Email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={globalStyles.modalInput}
            />

            <View style={globalStyles.modalActions}>
              <TouchableOpacity
                style={[globalStyles.modalButton, globalStyles.modalButtonSecondary]}
                onPress={() => setForgotPasswordVisible(false)}
              >
                <Text style={globalStyles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[globalStyles.modalButton, globalStyles.modalButtonPrimary]}
                onPress={() => setForgotPasswordVisible(false)}
              >
                <Text style={globalStyles.modalButtonTextPrimary}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}