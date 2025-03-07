import React, { useState } from 'react'
import { Alert, View, Dimensions, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import Svg, { Image, Ellipse, ClipPath  } from 'react-native-svg'
import styles from '@/styles'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  withTiming, 
  withDelay,
  withSequence,
  withSpring 
} from 'react-native-reanimated'



export default function Auth() {

  const { width, height } = Dimensions.get('window')
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);

  const imagePosition = useSharedValue(1)
  const formButtonScale = useSharedValue(1);


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
          translateY: interpolate(imagePosition.value, [0, 1], [-150, 100])//do we need this?
        }]
    }
  })
  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: formButtonScale.value}]
    }
  })
  const singInHandler = () => {
    console.log("Before:", imagePosition.value);
    imagePosition.value = 0;
    console.log("After:", imagePosition.value);
  };

  const singUpHandler = () => {
    imagePosition.value = 0
  }

  async function signInWithEmail() {
    setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (data.session) {
      router.replace('home')
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
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
            onPress={() => imagePosition.value = 1}
          >
            <View style={styles.closeButtonLine} />
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

          <TextInput
            placeholder="Full Name"
            style={styles.authTextInput}
            // value={email}
            // onChangeText={(text) => setEmail(text)}
          
          />

          <TextInput
            placeholder="Email"
            style={styles.authTextInput}
            // value={password}
            // onChangeText={(text) => setPassword(text)}
      
          />
          <TextInput
            placeholder="Password"
            style={styles.authTextInput}
            // value={confirmPassword}
            // onChangeText={(text) => setConfirmPassword(text)}
          
          />
         

          <Animated.View style={[styles.formButton, formButtonAnimatedStyle]}>
            <Pressable onPress={() => formButtonScale.value = withSequence(withSpring(1.5), withSpring(1))}>
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

