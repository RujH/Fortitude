import React, { useState } from 'react'
import { Alert, View, Dimensions, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { supabase } from '@/lib/providers/supabase'
import { useRouter } from 'expo-router'
import Svg, { Image, Ellipse, ClipPath  } from 'react-native-svg'
import styles from '@/styles'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  withTiming, 
  withDelay
} from 'react-native-reanimated'

// Add these styles to your styles import or define them inline
const forgotPasswordStyles = StyleSheet.create({
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginHorizontal: 30,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  }
});

export default function Auth() {

  const { width, height } = Dimensions.get('window')
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const imagePosition = useSharedValue(1)


  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [-height*0.7, 0])
    return {
      transform: [{
        translateY: withTiming(interpolation, { duration: 1000 })
      }]
    }
  })

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0])
    return {
      opacity: withTiming(imagePosition.value, { duration: 500 }),
      transform: [{
        translateY: withTiming(interpolation, { duration: 1000 })
      }]
    }
  })

  const closeButtonAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [180,360])
    return {
      opacity: withTiming(imagePosition.value == 1 ? 0 : 1, { duration: 800 }),
    }
  })

  const formInputAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 
        imagePosition.value === 0 
          ? withDelay(400, withTiming(1, { duration: 800 })) 
          : withTiming(0, { duration: 300 }),
        transform: [{
          translateY: interpolate(imagePosition.value, [0, 1], [-60, 100])
        }]
    }
  })

  const singInHandler = () => {
    imagePosition.value = 0;
    setIsRegistering(false);
  };

  const singUpHandler = () => {
    imagePosition.value = 0
    setIsRegistering(true);
  }

  // Function to reset form state
  const resetForm = () => {
    setFullName('')
    setEmail('')
    setPassword('')
    setErrorMessage('')
  }

  async function signInWithEmail() {
    // Reset any previous error messages
    setErrorMessage('')
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password')
      return
    }
    
    setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setErrorMessage(error.message)
    } else if (data.session) {
      router.replace('/screens/home')
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    // Reset any previous error messages
    setErrorMessage('')
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password')
      return
    }
    
    if (isRegistering && !fullName.trim()) {
      setErrorMessage('Please enter your full name')
      return
    }
    
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      setErrorMessage(error.message)
    } else if (!session) {
      Alert.alert('Please check your inbox for email verification!')
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Svg width={width} height={height+100}>
          <ClipPath id="clipPath">
            <Ellipse 
              cx={width/2} 
              rx={height}
              ry={height+100}
            />
          </ClipPath>
          <Image 
            href={require('@/assets/images/background.jpg')} 
            width={width * 4}
            height={height * 4}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clipPath)"
          />
        </Svg>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Fortitude</Text>
          <Text style={styles.subtitleText}>Optimize your strength</Text>
        </View>
        
        <Animated.View 
          style={[
            styles.closeButtonContainer, 
            closeButtonAnimatedStyle
          ]}>
          <Pressable 
            style={styles.closeButton} 
            onPress={() => {
              imagePosition.value = 1
              resetForm()
            }}
          >
            
          </Pressable>
        </Animated.View>

      </Animated.View>

      <View style={styles.buttonContainer}>
        <Animated.View style={ buttonAnimatedStyle}>
          <Pressable style={styles.button} onPress={singInHandler}>
              <Text style={styles.buttonText}>LOG IN</Text>
            </Pressable>
        </Animated.View>
        
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable style={styles.button} onPress={singUpHandler}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </Pressable>
        </Animated.View>
       
          

        <Animated.View style={[styles.formInputContainer, formInputAnimatedStyle]}>
          
          {isRegistering && (
            <TextInput
              placeholder="Full Name"
              style={styles.authTextInput}
              value={fullName}
              onChangeText={(text) => setFullName(text)}
            />
          )}

          <TextInput
            placeholder="Email"
            style={styles.authTextInput}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          
          <TextInput
            placeholder="Password"
            style={styles.authTextInput}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
          
          {/* Completely redesigned error message */}
          {errorMessage ? (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
              marginBottom: 8,
              paddingHorizontal: 10,
            }}>
              <View style={{
                width: 4,
                height: 16,
                backgroundColor: '#FF375F',
                marginRight: 8,
                borderRadius: 2,
              }} />
              <Text style={{
                color: '#FF375F',
                fontSize: 13,
                fontWeight: '500',
                flex: 1,
              }}>{errorMessage}</Text>
            </View>
          ) : null}
          
          {!isRegistering && (
            <View style={forgotPasswordStyles.forgotPasswordContainer}>
              <Pressable onPress={() => Alert.alert("Reset Password", "Password reset functionality will be implemented soon.")}>
                <Text style={forgotPasswordStyles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </View>
          )}

          <Animated.View style={styles.formButton}>
            <Pressable 
              onPress={() => {
                isRegistering ? signUpWithEmail() : signInWithEmail();
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {isRegistering ? "REGISTER" : "LOG IN"}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>


      </View>
    
    
      {/* <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View> */}


    </View>
  )
}

