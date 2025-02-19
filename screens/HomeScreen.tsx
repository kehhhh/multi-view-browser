import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  Animated,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import WebView from 'react-native-webview';
import { toast } from 'sonner-native';

interface BrowserView {
  id: string;
  type: 'website' | 'video';
  url: string;
  seed: number;
  isLoading: boolean;
}

const isVideoURL = (url: string): boolean => {
  const videoPatterns = [
    // YouTube patterns
    /youtube\.com\/watch\?v=|youtu\.be\//,
    // Instagram patterns
    /instagram\.com\/.*\/reels\/|instagram\.com\/p\/|instagram\.com\/tv\//,
    // Facebook patterns
    /facebook\.com.*\/videos\/|fb\.watch\//,
    // Twitter/X patterns
    /twitter\.com.*\/status\/|x\.com.*\/status\//,
    // Vimeo patterns
    /vimeo\.com\//,
    // TikTok patterns
    /tiktok\.com\/@.*\/video\//,
    // Direct video file patterns
    /\.(mp4|webm|ogg|mov)$/i
  ];
  return videoPatterns.some(pattern => pattern.test(url));
};

const extractVideoId = (url: string): string => {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?/]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&controls=1&fs=0`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&playsinline=1&title=0&byline=0&portrait=0`;

  // For other platforms, return the original URL
  return url;
};

interface HomeScreenProps {
  route: {
    params: {
      initialWindowCount: number;
    };
  };
}

export default function MultiViewBrowser({ route }: HomeScreenProps): JSX.Element {
  const MAX_WINDOWS = 100;
  const initialCount = route.params?.initialWindowCount || 2;
  
  const [browserViews, setBrowserViews] = useState<BrowserView[]>(() =>
    Array.from({ length: initialCount }, (_, index) => ({
      id: `view-${index}`,
      type: 'website',
      url: '',
      seed: Math.floor(Math.random() * 10000),
      isLoading: false
    }))
  );
  
  const [mainURL, setMainURL] = useState('');
  const [currentURL, setCurrentURL] = useState('');
  const [layout, setLayout] = useState<'grid' | 'stack'>('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fadeAnim = new Animated.Value(1);
  
  const generateSeed = () => Math.floor(Math.random() * 10000);

  const refreshView = (id: string) => {
    setBrowserViews(prev => prev.map(view => 
      view.id === id ? { ...view, seed: generateSeed(), isLoading: true } : view
    ));
    
    // Simulate loading state
    setTimeout(() => {
      setBrowserViews(prev => prev.map(view => 
        view.id === id ? { ...view, isLoading: false } : view
      ));
    }, 1500);
  };

  const refreshAll = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    setBrowserViews(prev => prev.map(view => ({ 
      ...view, 
      seed: generateSeed(),
      isLoading: true 
    })));

    setTimeout(() => {
      setBrowserViews(prev => prev.map(view => ({ 
        ...view,
        isLoading: false 
      })));
    }, 1500);
  };

  const applyMainURL = () => {
    if (!mainURL.trim()) return;

    const isVideo = isVideoURL(mainURL);
    const processedUrl = extractVideoId(mainURL);
    
    // First update the current URL
    setCurrentURL(processedUrl);

    // Then update all browser views
    setBrowserViews(prev => prev.map(view => ({
      ...view,
      url: processedUrl,
      type: isVideo ? 'video' : 'website',
      isLoading: true
    })));

    toast.success('URL applied to all views');

    // Reset loading state after a delay
    setTimeout(() => {
      setBrowserViews(prev => prev.map(view => ({
        ...view,
        isLoading: false
      })));
    }, 1500);
  };

  const addView = () => {
    if (browserViews.length < MAX_WINDOWS) {
      const lastView = browserViews[browserViews.length - 1];
      setBrowserViews(prev => [...prev, {
        id: `view-${Date.now()}`,
        type: lastView.type,
        url: lastView.url,
        seed: generateSeed(),
        isLoading: false
      }]);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const removeView = (id: string) => {
    if (browserViews.length > 1) {
      setBrowserViews(prev => prev.filter(view => view.id !== id));
    }
  };

  const closeAll = () => {
    // Keep only the first two windows with empty state
    setBrowserViews(prev => prev.slice(0, 2).map(view => ({
      ...view,
      type: 'website',
      url: '',
      seed: generateSeed(),
      isLoading: false
    })));
    
    // Reset current URL
    setCurrentURL('');
    setMainURL('');
    toast.success('All windows reset');
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'grid' ? 'stack' : 'grid');
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const renderContent = (view: BrowserView) => {
    if (view.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196f3" />
        </View>
      );
    }

    if (view.type === 'video' && view.url) {
      if (view.url.includes('youtube.com/embed/') || view.url.includes('player.vimeo.com')) {
        // For YouTube/Vimeo, use iframe parameters to control behavior
        const embedUrl = view.url.includes('youtube.com') 
          ? `${view.url}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&controls=1&fs=0`
          : `${view.url}?autoplay=1&muted=1&playsinline=1&title=0&byline=0&portrait=0`;
        
        return (
          <WebView
            source={{ uri: embedUrl }}
            style={styles.browserImage}
            allowsFullscreenVideo={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            scrollEnabled={false}
            bounces={false}
            injectedJavaScript={`
              (function() {
                const video = document.querySelector('video');
                if (video) {
                  video.setAttribute('playsinline', 'true');
                  video.setAttribute('webkit-playsinline', 'true');
                  video.setAttribute('controls', 'true');
                  video.style.width = '100%';
                  video.style.height = '100%';
                  video.style.maxWidth = '100%';
                  video.style.position = 'relative';
                }
                // For YouTube
                if (window.YT) {
                  window.YT.ready(() => {
                    new YT.Player('player', {
                      events: {
                        onReady: (event) => {
                          event.target.playVideo();
                          event.target.mute();
                        }
                      }
                    });
                  });
                }
                true;
              })();
            `}
            onShouldStartLoadWithRequest={(request) => {
              // Only allow the main frame and direct video URL loads
              return request.url === embedUrl;
            }}
          />
        );
      }

      // For direct video files, use the Video component
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: view.url }}
            style={styles.browserImage}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={true}
            isMuted={true}
            positionMillis={0}
          />
        </View>
      );
    }

    return (
      <Image
        source={{ 
          uri: view.url 
            ? `https://api.a0.dev/assets/image?text=${encodeURIComponent(view.url)}&seed=${view.seed}&aspect=16:9`
            : `https://api.a0.dev/assets/image?text=empty+browser+window&seed=${view.seed}&aspect=16:9`
        }}
        style={styles.browserImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      isDarkMode && styles.containerDark
    ]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f2f5']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={[
              styles.headerText,
              isDarkMode && styles.headerTextDark
            ]}>Multi-View Browser</Text>
            <View style={styles.headerControls}>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                <Feather 
                  name={isDarkMode ? 'sun' : 'moon'} 
                  size={24} 
                  color={isDarkMode ? '#fff' : '#000'} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleLayout} style={styles.layoutToggle}>
                <MaterialIcons 
                  name={layout === 'grid' ? 'view-agenda' : 'grid-view'} 
                  size={24} 
                  color={isDarkMode ? '#fff' : '#2196f3'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlPanel}>
            <View style={styles.mainUrlContainer}>
              <TextInput
                style={[
                  styles.mainUrlInput,
                  isDarkMode && styles.mainUrlInputDark
                ]}
                placeholder="Enter URL for all windows..."
                placeholderTextColor={isDarkMode ? '#888' : '#666'}
                value={mainURL}
                onChangeText={setMainURL}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <TouchableOpacity 
                onPress={applyMainURL} 
                style={[
                  styles.loadButton,
                  !mainURL.trim() && styles.loadButtonDisabled
                ]}
                disabled={!mainURL.trim()}
              >
                <Ionicons name="play-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.viewCountContainer}>
              <BlurView
                intensity={isDarkMode ? 20 : 70}
                tint={isDarkMode ? 'dark' : 'light'}
                style={styles.statsContainer}
              >
                <Text style={[
                  styles.viewCountText,
                  isDarkMode && styles.viewCountTextDark
                ]}>
                  Views: {browserViews.length}
                </Text>
                <TouchableOpacity 
                  onPress={addView} 
                  style={[
                    styles.controlButton,
                    browserViews.length >= MAX_WINDOWS && styles.disabledButton
                  ]}
                  disabled={browserViews.length >= MAX_WINDOWS}
                >
                  <Ionicons 
                    name="add-circle" 
                    size={28} 
                    color={isDarkMode ? '#4caf50' : '#4caf50'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={refreshAll} 
                  style={[
                    styles.refreshAllButton,
                    isDarkMode && styles.refreshAllButtonDark
                  ]}
                >
                  <Ionicons 
                    name="sync" 
                    size={24} 
                    color={isDarkMode ? '#fff' : '#2196f3'} 
                  />
                  <Text style={[
                    styles.refreshAllText,
                    isDarkMode && styles.refreshAllTextDark
                  ]}>Refresh All</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={closeAll} 
                  style={[
                    styles.closeAllButton,
                    isDarkMode && styles.closeAllButtonDark
                  ]}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={24} 
                    color={isDarkMode ? '#fff' : '#ff5252'} 
                  />
                  <Text style={[
                    styles.closeAllText,
                    isDarkMode && styles.closeAllTextDark
                  ]}>Close All</Text>
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>
        </LinearGradient>

        <Animated.View 
          style={[
            styles.gridContainer,
            layout === 'stack' && styles.stackContainer,
            { opacity: fadeAnim }
          ]}
        >
          {browserViews.map((view) => (
            <Animated.View 
              key={view.id} 
              style={[
                styles.card,
                layout === 'stack' && styles.stackCard,
                isDarkMode && styles.cardDark
              ]}
            >
              <View style={styles.imageContainer}>
                {renderContent(view)}
                <BlurView
                  intensity={70}
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={styles.cardOverlay}
                >
                  <View style={[
                    styles.urlButton,
                    isDarkMode && styles.urlButtonDark
                  ]}>
                    <Text 
                      style={[
                        styles.urlText,
                        isDarkMode && styles.urlTextDark
                      ]} 
                      numberOfLines={1}
                    >
                      {view.url || 'No URL'}
                    </Text>
                  </View>
                  <View style={styles.cardControls}>
                    <TouchableOpacity 
                      style={[
                        styles.iconButton,
                        isDarkMode && styles.iconButtonDark
                      ]} 
                      onPress={() => refreshView(view.id)}
                    >
                      <Ionicons 
                        name="refresh" 
                        size={20} 
                        color={isDarkMode ? '#fff' : '#ffffff'} 
                      />
                    </TouchableOpacity>
                    {browserViews.length > 1 && (
                      <TouchableOpacity 
                        style={[
                          styles.iconButton,
                          styles.closeButton,
                          isDarkMode && styles.iconButtonDark
                        ]} 
                        onPress={() => removeView(view.id)}
                      >
                        <Ionicons 
                          name="close" 
                          size={20} 
                          color={isDarkMode ? '#fff' : '#ffffff'} 
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </BlurView>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  headerGradient: {
    padding: 16,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerTextDark: {
    color: '#ffffff',
  },
  themeToggle: {
    padding: 8,
    marginRight: 8,
  },
  layoutToggle: {
    padding: 8,
  },
  controlPanel: {
    width: '100%',
    marginBottom: 16,
  },
  mainUrlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainUrlInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainUrlInputDark: {
    backgroundColor: '#2d2d2d',
    borderColor: '#444',
    color: '#fff',
  },
  loadButton: {
    marginLeft: 8,
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadButtonDisabled: {
    opacity: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingRight: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    flexWrap: 'wrap',
    gap: 8,
  },
  viewCountContainer: {
    marginBottom: 8,
  },
  viewCountText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
    color: '#333',
  },
  viewCountTextDark: {
    color: '#fff',
  },
  controlButton: {
    marginHorizontal: 4,
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  refreshAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    minWidth: 100,
    justifyContent: 'center',
  },
  refreshAllButtonDark: {
    backgroundColor: '#1a1a1a',
  },
  refreshAllText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#2196f3',
  },
  refreshAllTextDark: {
    color: '#fff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  stackContainer: {
    flexDirection: 'column',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#2d2d2d',
  },
  stackCard: {
    width: '100%',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  browserImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urlButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  urlButtonDark: {
    backgroundColor: 'rgba(45,45,45,0.9)',
  },
  urlText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  urlTextDark: {
    color: '#fff',
  },
  cardControls: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    marginLeft: 6,
  },
  iconButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    backgroundColor: 'rgba(244,67,54,0.8)',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  closeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffebee',
    borderRadius: 20,
    minWidth: 100,
    justifyContent: 'center',
  },
  closeAllButtonDark: {
    backgroundColor: '#4a1515',
  },
  closeAllText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#ff5252',
  },
  closeAllTextDark: {
    color: '#ff5252',
  },
});