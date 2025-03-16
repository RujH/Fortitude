import { StyleSheet, Pressable, View, Text, Alert } from 'react-native';

type CardProps = {
  title: string;
  subtitle: string;
  date: string;
  onPress?: () => void;
};

export default function Card({ title, subtitle, date, onPress }: CardProps) {
  return (
    <View>
      <Pressable 
        style={({ pressed }) => [
          styles.card,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={onPress}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
        {date && <Text>{date}</Text>}
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  cardsContainer: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

