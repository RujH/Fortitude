import {StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    button: {
      backgroundColor: 'orange',
      height: 55,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'white',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonContainer: {
      height: height/3.5,  
      justifyContent: 'center',
    },
    authTextInput: {
      height: 50,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      borderRadius: 25,
      marginHorizontal: 20,
      marginVertical: 10,
      paddingLeft: 10,
      
    },
    formButton: {
      backgroundColor: 'orange',
      height: 55,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'orange',
      shadowColor: '0000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 3.84,
      elevation: 5,
      
    },
    formInputContainer: {
      marginBottom: 70,
      zIndex: -1,
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center'
    },

    closeButtonContainer: {
      width: 60,
      height: 8,
      backgroundColor: '#000000',
      alignSelf: 'center',
      borderRadius: 20,
      marginVertical: 10,
      marginBottom: 10,
      marginTop: -20
    },
    closeButton: {
        height: 40,
        width: '100%',
      },
    titleContainer: {
      position: 'absolute',
      top: 60,
      left: 20,
    },
    titleText: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    subtitleText: {
      fontSize: 16,
      color: '#1a1a1a',
      marginTop: 5,
    },
  })    

export default styles;