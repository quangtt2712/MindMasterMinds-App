
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Animated,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const slides = [
  {
    title: 'Taste of knowlegde.',
    message:
      'Daily updates of high-quality courses, documents, and academic articles.',
    action: 'MindMasterminds',
  },
  {
    title: 'Your Premier Choice for Academic Success',
    message:
      'Where Youll Find the Exclusive Three Outstanding Features',
    action: 'Continue',
  },
  {
    title: "About Us",
    message:
      'Build a breakthrough intermediary platform in supporting learning, connecting knowledge and guidance easily and effectively.',
    action: 'Start exploring',
  },
];

const elements = [
  {
    uri: 'https://mind-master-minds-fe.vercel.app/images/premier_choice.png',
    position: [-50, 15],
    rotate: '15deg',
  },
  {
    uri: 'https://ggie.berkeley.edu/wp-content/uploads/2019/04/Teacher_Student_Relationship_1410x820-705x410.jpg',
    position: [180, 120],
    rotate: '-10deg',
  },
  {
    uri: 'https://cdn.mos.cms.futurecdn.net/W8HPMMifmagz7BbUN3pnUL-415-80.jpg',
    position: [540, 50],
    rotate: '20deg',
  },
  {
    uri: 'https://images.unsplash.com/photo-1626118788936-29dc02466e96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJlc3RyYXVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    position: [540, 50],
    rotate: '20deg',
  },
  {
    uri: 'data:image/jpeg;base64,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',
    position: [860, 25],
    rotate: '-4deg',
  },
];

function Background() {
  return (
    <View style={styles.elements}>
      {elements.map(({ uri, position: [x, y], rotate }, index) => (
        <View
          style={[
            styles.element,
            {
              zIndex: elements.length - index,
            },
          ]}
          key={index}>
          <Image
            style={[
              styles.elementImage,
              {
                width: width * 0.8,
                height: width * 0.6,
                top: y,
                left: x,
                transform: [{ rotate }],
              },
            ]}
            source={{ uri }}
          />
        </View>
      ))}
    </View>
  );
}

export default function LandingScreen({ navigation }) {
  const [slide, setSlide] = useState(0);

  const swiper = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  const contentOpacityRanges = Array.from({ length: slides.length }).reduce(
    (acc, _, index) => {
      const screenWidth = index * width;
      const screenWidthMiddle = screenWidth + width / 2;

      acc.inputRange.push(screenWidth, screenWidthMiddle);
      // opacity 1 when screen is presented, 0.2 when screens are switching (mid point).
      acc.outputRange.push(1, 0.2);

      return acc;
    },
    {
      inputRange: [],
      outputRange: [],
    },
  );
  const contentOpacity = scrollX.interpolate(contentOpacityRanges);

  const animatedBackgroundLeft = scrollX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0, -1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          left: animatedBackgroundLeft,
        }}>
        <Background />
      </Animated.View>
      <Swiper
        ref={swiper}
        showsPagination={false}
        loop={false}
        onIndexChanged={setSlide}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={1}>
        {slides.map(({ title, message, action }, index) => {
          return (
            <Animated.View
              style={[styles.slide, { opacity: contentOpacity }]}
              key={index}>
              <Text style={styles.slideTitle}>{title}</Text>
              <Text style={styles.slideText}>{message}</Text>

              {/* Update the onPress handler of the last slide's button */}
              <TouchableOpacity
                onPress={() => {
                  if (index === slides.length - 1) {
                    // Navigate to "BottomTabs" screen
                    navigation.navigate('BottomTabs');
                  } else {
                    swiper.current.scrollTo(slide + 1, true);
                  }
                }}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>{action}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Swiper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  elements: {
    width: width * slides.length,
    height: 0.6 * height,
    position: 'absolute',
    top: 47,
    left: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#B0C5A4',
  },
  /** Element */
  element: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  elementImage: {
    borderRadius: 24,
  },
  /** Slide */
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  slideTitle: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '600',
    color: '#0d0d0d',
    marginBottom: 12,
  },
  slideText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d0d0d',
  },
  /** Button */
  button: {
    backgroundColor: '#0d0d0d',
    padding: 18,
    borderRadius: 12,
    marginTop: 48,
    marginBottom: 36,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

