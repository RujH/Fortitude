import React, { useState } from 'react'
import { Alert, View, Dimensions, Text } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import Svg, { Image, Ellipse, ClipPath  } from 'react-native-svg'
import styles from '@/styles'


export default function InitScreen() {

  const { width, height } = Dimensions.get('window')
  const router = useRouter()


  return (
    <View style={styles.container}>
      <View>
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
        
      </View>

    </View>
  )
}

